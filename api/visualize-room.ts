/**
 * Vercel Serverless Function: POST /api/visualize-room
 *
 * Accepts an uploaded room photograph, a composite placement reference image,
 * and selected Flora plant + pot metadata. Calls the official OpenAI Images Edit API
 * (POST https://api.openai.com/v1/images/edits) to generate a realistic interior
 * room preview while preserving original furniture, lighting, and perspective.
 *
 * Security & Privacy:
 * - OPENAI_API_KEY is kept strictly server-side.
 * - CORS restricted via ALLOWED_ORIGINS environment variable.
 * - Rate limited via Upstash Redis REST API (with in-memory fallback).
 * - Strict MIME + magic-byte signature validation for JPG, PNG, and WebP.
 * - Ephemeral processing: customer room photographs are never stored permanently.
 */

export interface VisualizeRoomRequestBody {
  roomImageDataUrl: string;
  compositeGuideDataUrl?: string;
  plant: {
    id: string;
    name: string;
    scientificName: string;
    light: string;
  };
  pot: {
    id: string;
    name: string;
    color: string;
    material: string;
  };
  placement: {
    x: number;
    y: number;
    scale: number;
    rotation: number;
    flipX?: boolean;
  };
}

interface VercelRequestLike {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
}

interface VercelResponseLike {
  status: (code: number) => VercelResponseLike;
  setHeader: (name: string, value: string) => void;
  json: (payload: unknown) => void;
  end: () => void;
}

declare const process: {
  env: Record<string, string | undefined>;
};

const DEFAULT_ALLOWED_ORIGINS = [
  'https://cigarfeine.github.io',
  'http://localhost:5173',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:4173',
];

const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8 MB max per image
const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_WINDOW_SECONDS = 600; // 5 requests per 10 minutes per IP

const ALLOWED_MODELS = new Set([
  'gpt-image-2.5-sunburst',
  'gpt-image-2.5-sunburst-2026-09-08',
  'gpt-image-2.5-flare',
  'gpt-image-2.5-flare-2026-09-08',
  'gpt-image-2',
  'gpt-image-2-2026-04-21',
  'gpt-image-1.5',
  'gpt-image-1-mini',
  'chatgpt-image-latest',
]);

// Ephemeral in-memory rate limit map (fallback when Upstash env vars are not set)
const memoryRateStore = new Map<string, { count: number; resetAt: number }>();

function getHeader(headers: Record<string, string | string[] | undefined>, key: string): string {
  const val = headers[key.toLowerCase()] ?? headers[key];
  if (Array.isArray(val)) return val[0] || '';
  return val || '';
}

function getAllowedOrigins(): string[] {
  const raw = process.env.ALLOWED_ORIGINS;
  if (!raw || !raw.trim()) return DEFAULT_ALLOWED_ORIGINS;
  return raw
    .split(',')
    .map((o) => o.trim().replace(/\/$/, ''))
    .filter(Boolean);
}

function getClientIp(headers: Record<string, string | string[] | undefined>): string {
  const forwarded = getHeader(headers, 'x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = getHeader(headers, 'x-real-ip');
  return realIp ? realIp.trim() : 'anonymous-client';
}

/**
 * Simple FNV-1a hash to create a privacy-preserving safety_identifier (<= 128 chars)
 * without sending raw client IP addresses to OpenAI.
 */
function hashSafetyIdentifier(input: string): string {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `flora_user_${(hash >>> 0).toString(16)}`;
}

/**
 * Enforces rate limiting using Upstash Redis REST API when configured,
 * with automatic fallback to in-memory sliding counter.
 */
async function checkRateLimit(clientIp: string): Promise<{
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, '');
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  const windowBucket = Math.floor(Date.now() / (RATE_LIMIT_WINDOW_SECONDS * 1000));
  const redisKey = `flora:ratelimit:visualize:${clientIp}:${windowBucket}`;
  const resetSeconds =
    RATE_LIMIT_WINDOW_SECONDS - (Math.floor(Date.now() / 1000) % RATE_LIMIT_WINDOW_SECONDS);

  if (upstashUrl && upstashToken) {
    try {
      const response = await fetch(`${upstashUrl}/pipeline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          ['INCR', redisKey],
          ['EXPIRE', redisKey, RATE_LIMIT_WINDOW_SECONDS],
        ]),
      });

      if (response.ok) {
        const result = (await response.json()) as Array<{ result?: number }>;
        const currentCount = Number(result?.[0]?.result ?? 1);
        const remaining = Math.max(0, RATE_LIMIT_MAX_REQUESTS - currentCount);
        return {
          allowed: currentCount <= RATE_LIMIT_MAX_REQUESTS,
          limit: RATE_LIMIT_MAX_REQUESTS,
          remaining,
          resetSeconds,
        };
      }
    } catch {
      // Fall through to in-memory limiter if Upstash network request fails
    }
  }

  const now = Date.now();
  const entry = memoryRateStore.get(clientIp);
  if (!entry || now > entry.resetAt) {
    memoryRateStore.set(clientIp, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_SECONDS * 1000,
    });
    return {
      allowed: true,
      limit: RATE_LIMIT_MAX_REQUESTS,
      remaining: RATE_LIMIT_MAX_REQUESTS - 1,
      resetSeconds: RATE_LIMIT_WINDOW_SECONDS,
    };
  }

  entry.count += 1;
  const remaining = Math.max(0, RATE_LIMIT_MAX_REQUESTS - entry.count);
  return {
    allowed: entry.count <= RATE_LIMIT_MAX_REQUESTS,
    limit: RATE_LIMIT_MAX_REQUESTS,
    remaining,
    resetSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
  };
}

/**
 * Validates that a string is a base64 Data URL for a valid JPEG, PNG, or WebP image,
 * checks file size bounds, and verifies binary magic-byte signatures.
 */
function validateImageDataUrl(
  dataUrl: unknown,
  label: string
): { valid: true; mimeType: string; byteLength: number } | { valid: false; error: string } {
  if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
    return { valid: false, error: `${label} must be a valid base64 image data URL.` };
  }

  const match = dataUrl.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=\s]+)$/);
  if (!match) {
    return {
      valid: false,
      error: `${label} must be encoded as image/jpeg, image/png, or image/webp.`,
    };
  }

  const mimeType = match[1];
  const base64Data = match[2].replace(/\s+/g, '');
  const estimatedBytes = Math.floor((base64Data.length * 3) / 4);

  if (estimatedBytes < 64) {
    return { valid: false, error: `${label} is too small or corrupted.` };
  }

  if (estimatedBytes > MAX_IMAGE_BYTES) {
    return {
      valid: false,
      error: `${label} exceeds the maximum allowed size of 8 MB.`,
    };
  }

  // Decode the first 16 bytes to verify magic-byte file signatures
  try {
    const headerSlice = base64Data.slice(0, 24);
    const binaryStr = atob(headerSlice);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }

    const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    const isPng =
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47;
    const isWebp =
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50;

    if (!isJpeg && !isPng && !isWebp) {
      return {
        valid: false,
        error: `${label} binary header does not match JPEG, PNG, or WebP magic bytes.`,
      };
    }
  } catch {
    return { valid: false, error: `${label} contains invalid base64 encoding.` };
  }

  return { valid: true, mimeType, byteLength: estimatedBytes };
}

function sanitizeText(val: unknown, maxLen = 80): string {
  if (typeof val !== 'string') return '';
  return val.replace(/[^\w\s.,()&-]/g, '').trim().slice(0, maxLen);
}

function describePlacementRegion(x: number, y: number, scale: number): string {
  const horiz = x < 0.36 ? 'left side' : x > 0.64 ? 'right side' : 'center';
  const vert = y < 0.45 ? 'upper surface area' : y > 0.72 ? 'foreground floor area' : 'mid-ground surface';
  const sizeDesc =
    scale < 0.75 ? 'compact tabletop/accent scale' : scale > 1.25 ? 'large statement floor scale' : 'natural medium-large architectural scale';
  return `${horiz} (${Math.round(x * 100)}% from left), ${vert} (${Math.round(y * 100)}% from top), at a ${sizeDesc}`;
}

export default async function handler(req: VercelRequestLike, res: VercelResponseLike): Promise<void> {
  const origin = getHeader(req.headers, 'origin').replace(/\/$/, '');
  const allowedOrigins = getAllowedOrigins();
  const isOriginPermitted = !origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*');

  if (origin && isOriginPermitted) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method === 'OPTIONS') {
    if (!isOriginPermitted) {
      res.status(403).json({ error: 'Origin not permitted by CORS policy.', code: 'cors_forbidden' });
      return;
    }
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({
      error: 'Method not allowed. Use POST /api/visualize-room.',
      code: 'method_not_allowed',
    });
    return;
  }

  if (!isOriginPermitted) {
    res.status(403).json({
      error: 'Origin not permitted by CORS policy.',
      code: 'cors_forbidden',
      fallbackAvailable: true,
    });
    return;
  }

  // 1. Check Rate Limit
  const clientIp = getClientIp(req.headers);
  const rateStatus = await checkRateLimit(clientIp);
  res.setHeader('X-RateLimit-Limit', String(rateStatus.limit));
  res.setHeader('X-RateLimit-Remaining', String(rateStatus.remaining));
  res.setHeader('X-RateLimit-Reset', String(rateStatus.resetSeconds));

  if (!rateStatus.allowed) {
    res.status(429).json({
      error: `Rate limit reached (${rateStatus.limit} AI visualizations per 10 minutes). You can continue editing and downloading your manual Canvas composition without restriction.`,
      code: 'rate_limit_exceeded',
      retryAfterSeconds: rateStatus.resetSeconds,
      fallbackAvailable: true,
    });
    return;
  }

  // 2. Check OpenAI API Key Configuration
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    res.status(503).json({
      error: 'AI Room Visualization server is not configured with an OPENAI_API_KEY yet. Manual Canvas compositing and high-res PNG downloads remain fully active.',
      code: 'ai_unconfigured',
      fallbackAvailable: true,
    });
    return;
  }

  // 3. Parse & Validate Request Body
  let body: Partial<VisualizeRoomRequestBody>;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body as Partial<VisualizeRoomRequestBody>) || {};
  } catch {
    res.status(400).json({
      error: 'Invalid JSON request payload.',
      code: 'invalid_json',
      fallbackAvailable: true,
    });
    return;
  }

  const roomCheck = validateImageDataUrl(body.roomImageDataUrl, 'Room photograph');
  if (!roomCheck.valid) {
    res.status(400).json({
      error: roomCheck.error,
      code: 'invalid_room_image',
      fallbackAvailable: true,
    });
    return;
  }

  if (body.compositeGuideDataUrl) {
    const guideCheck = validateImageDataUrl(body.compositeGuideDataUrl, 'Composite placement guide');
    if (!guideCheck.valid) {
      res.status(400).json({
        error: guideCheck.error,
        code: 'invalid_guide_image',
        fallbackAvailable: true,
      });
      return;
    }
  }

  const plantName = sanitizeText(body.plant?.name, 60) || 'Swiss Cheese Monstera';
  const plantScientific = sanitizeText(body.plant?.scientificName, 60) || 'Monstera Deliciosa';
  const potName = sanitizeText(body.pot?.name, 60) || 'Ribbed Ceramic Planter';
  const potColor = sanitizeText(body.pot?.color, 60) || 'Matte Ash Grey';
  const potMaterial = sanitizeText(body.pot?.material, 60) || 'Matte Ceramic';

  const x = Number(body.placement?.x ?? 0.5);
  const y = Number(body.placement?.y ?? 0.8);
  const scale = Number(body.placement?.scale ?? 1.0);
  const rotation = Number(body.placement?.rotation ?? 0);

  if (
    !Number.isFinite(x) || x < 0.05 || x > 0.95 ||
    !Number.isFinite(y) || y < 0.05 || y > 0.98 ||
    !Number.isFinite(scale) || scale < 0.25 || scale > 2.5 ||
    !Number.isFinite(rotation) || rotation < -90 || rotation > 90
  ) {
    res.status(400).json({
      error: 'Placement coordinates or scale values are out of valid bounds.',
      code: 'invalid_placement',
      fallbackAvailable: true,
    });
    return;
  }

  // 4. Construct Official OpenAI /v1/images/edits Payload
  const configuredModel = process.env.OPENAI_IMAGE_MODEL?.trim() || 'gpt-image-2.5-sunburst';
  const model = ALLOWED_MODELS.has(configuredModel) ? configuredModel : 'gpt-image-2.5-sunburst';
  const placementDescription = describePlacementRegion(x, y, scale);

  const prompt = [
    `Photorealistic architectural interior visualization: seamlessly integrate a healthy, lush ${plantName} (${plantScientific}) potted inside a ${potName} (${potColor}, ${potMaterial} finish) into the uploaded room photograph.`,
    body.compositeGuideDataUrl
      ? `Use the second reference image as the exact spatial placement, scale, and orientation guide: place the plant and pot at the ${placementDescription}.`
      : `Place the plant and pot naturally at the ${placementDescription}.`,
    `CRITICAL PRESERVATION RULES:`,
    `1. Preserve the original room photograph's exact walls, flooring, furniture, decor, architectural geometry, camera lens perspective, and color temperature without altering or removing existing objects.`,
    `2. Match the room's natural ambient and directional lighting on the plant leaves and ${potMaterial} planter surface.`,
    `3. Render realistic ground contact occlusion and soft cast shadows beneath the base of the ${potName} on the floor or surface so it looks physically grounded in the space.`,
  ].join(' ');

  const imagesPayload: Array<{ image_url: string }> = [
    { image_url: body.roomImageDataUrl as string },
  ];
  if (body.compositeGuideDataUrl) {
    imagesPayload.push({ image_url: body.compositeGuideDataUrl });
  }

  const openAiRequestBody: Record<string, unknown> = {
    model,
    images: imagesPayload,
    prompt,
    quality: process.env.OPENAI_IMAGE_QUALITY?.trim() || 'high',
    size: 'auto',
    output_format: 'png',
    moderation: 'auto',
    safety_identifier: hashSafetyIdentifier(clientIp),
  };

  // Per official OpenAI API docs: input_fidelity is supported on gpt-image-1.5 ('high'/'low')
  // and gpt-image-1-mini ('low'), and must be omitted on gpt-image-2 / gpt-image-2.5 models.
  if (model === 'gpt-image-1.5') {
    openAiRequestBody.input_fidelity = 'high';
  }

  try {
    const openAiResponse = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(openAiRequestBody),
    });

    const responseJson = (await openAiResponse.json()) as {
      data?: Array<{ b64_json?: string }>;
      output_format?: string;
      usage?: unknown;
      error?: {
        message?: string;
        type?: string;
        code?: string;
        moderation_details?: {
          moderation_stage?: string;
          categories?: string[];
        };
      };
    };

    if (!openAiResponse.ok) {
      const errCode = responseJson?.error?.code || 'openai_api_error';
      if (errCode === 'moderation_blocked') {
        res.status(400).json({
          error: 'The uploaded image could not be processed due to content safety filters. Please try a clear interior room photograph.',
          code: 'moderation_blocked',
          fallbackAvailable: true,
        });
        return;
      }

      res.status(openAiResponse.status >= 500 ? 502 : openAiResponse.status).json({
        error:
          responseJson?.error?.message ||
          'OpenAI image editing service encountered an error. Your manual room composition remains available.',
        code: errCode,
        fallbackAvailable: true,
      });
      return;
    }

    const b64Image = responseJson?.data?.[0]?.b64_json;
    if (!b64Image) {
      res.status(502).json({
        error: 'OpenAI returned an empty image payload. Please use the manual composition preview.',
        code: 'empty_image_response',
        fallbackAvailable: true,
      });
      return;
    }

    const outFormat = responseJson.output_format || 'png';
    res.status(200).json({
      imageDataUrl: `data:image/${outFormat};base64,${b64Image}`,
      modelUsed: model,
      usage: responseJson.usage ?? null,
    });
  } catch {
    res.status(502).json({
      error: 'Network timeout or connection error while contacting OpenAI Image API. Manual Canvas composition remains active.',
      code: 'upstream_network_error',
      fallbackAvailable: true,
    });
  }
}
