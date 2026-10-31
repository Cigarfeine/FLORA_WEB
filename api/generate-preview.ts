type PreviewRequest = {
  roomImage?: string;
  plantName?: string;
  plantImageUrl?: string;
  potName?: string;
  potImageUrl?: string;
  placement?: {
    x?: number;
    y?: number;
    scale?: number;
    rotation?: number;
  };
};

type ApiRequest = {
  method?: string;
  headers: { origin?: string; 'x-forwarded-for'?: string };
  body?: PreviewRequest | string;
};

type ApiResponse = {
  setHeader(name: string, value: string): void;
  status(code: number): ApiResponse;
  json(payload: unknown): void;
  end(): void;
};

const MAX_DATA_URL_LENGTH = 4_000_000;
const ALLOWED_IMAGE_HOSTS = new Set(['images.unsplash.com', 'static.wixstatic.com']);

const isAllowedImageUrl = (value: unknown): value is string => {
  if (typeof value !== 'string' || value.length > 2048) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && ALLOWED_IMAGE_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
};

const clamp = (value: unknown, minimum: number, maximum: number, fallback: number): number => {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return fallback;
  return Math.min(maximum, Math.max(minimum, numberValue));
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Vary', 'Origin');

  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  const origin = req.headers.origin || '';

  if (!origin || !allowedOrigins.includes(origin)) {
    return res.status(403).json({ error: 'This website is not permitted to use the preview service.' });
  }

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'The AI preview service is not configured yet.' });
  }

  // Require a shared rate-limit store before enabling a billable public endpoint.
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  const forwardedFor = req.headers['x-forwarded-for'];
  const clientIp = forwardedFor?.split(',')[0]?.trim();

  if (!redisUrl || !redisToken || !clientIp) {
    return res.status(503).json({
      error: 'AI preview protection is not configured. Please try the manual preview instead.',
    });
  }

  try {
    const rateLimitResponse = await fetch(redisUrl.replace(/\\/$/, '') + '/pipeline', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + redisToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', 'flora:ai-preview:' + clientIp],
        ['EXPIRE', 'flora:ai-preview:' + clientIp, 60],
      ]),
    });

    if (!rateLimitResponse.ok) {
      return res.status(503).json({ error: 'AI preview protection is temporarily unavailable.' });
    }

    const rateLimitResults = await rateLimitResponse.json() as Array<{ result?: number }>;
    const requestCount = Number(rateLimitResults?.[0]?.result ?? 0);
    if (requestCount > 5) {
      res.setHeader('Retry-After', '60');
      return res.status(429).json({
        error: 'You have reached the preview limit. Please wait a minute before trying again.',
      });
    }
  } catch {
    return res.status(503).json({ error: 'AI preview protection is temporarily unavailable.' });
  }

  let body: PreviewRequest;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) as PreviewRequest : (req.body || {});
  } catch {
    return res.status(400).json({ error: 'Invalid request body.' });
  }

  const roomImage = body.roomImage || '';
  const validRoomImage =
    typeof roomImage === 'string' &&
    roomImage.length <= MAX_DATA_URL_LENGTH &&
    /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(roomImage);

  if (!validRoomImage) {
    return res.status(400).json({ error: 'Upload a valid room photo under the supported size limit.' });
  }
  if (!isAllowedImageUrl(body.plantImageUrl) || !isAllowedImageUrl(body.potImageUrl)) {
    return res.status(400).json({ error: 'The selected catalogue images are not from an approved image host.' });
  }

  const plantName = String(body.plantName || 'selected indoor plant').slice(0, 120);
  const potName = String(body.potName || 'selected planter').slice(0, 120);
  const x = clamp(body.placement?.x, 0, 100, 72);
  const y = clamp(body.placement?.y, 0, 100, 72);
  const scale = clamp(body.placement?.scale, 18, 60, 34);
  const rotation = clamp(body.placement?.rotation, -25, 25, 0);

  const prompt = [
    'Create a photorealistic interior styling preview using the first image as the exact room photograph.',
    'Preserve the room architecture, furniture, existing objects, camera viewpoint, perspective, and overall lighting. Do not redesign or rearrange the room.',
    'Add one realistic ' + plantName + ' using the second image as its botanical appearance reference.',
    'Place it in the ' + potName + ', using the third image as the planter appearance reference. The plant must visibly sit inside the selected planter.',
    'Place the arrangement near the user-selected point, approximately ' + x + '% from the left and ' + y + '% from the top of the room image.',
    'Use an approximate visual width of ' + scale + '% of the image and a subtle rotation of ' + rotation + ' degrees.',
    'Make the plant feel physically present with believable scale, perspective, contact shadow, ambient occlusion, and lighting that matches the original photograph.',
    'Do not add text, labels, watermarks, extra plants, people, or unrelated decor.',
    'This is a product visualization concept; preserve the source room as faithfully as possible.'
  ].join(' ');

  try {
    const upstream = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-2.5-sunburst',
        images: [
          { image_url: roomImage },
          { image_url: body.plantImageUrl },
          { image_url: body.potImageUrl },
        ],
        prompt,
        quality: 'medium',
        size: 'auto',
        output_format: 'jpeg',
        output_compression: 88,
        n: 1,
      }),
    });

    const result = await upstream.json() as {
      data?: Array<{ b64_json?: string }>;
      error?: { message?: string };
    };

    if (!upstream.ok) {
      return res.status(upstream.status >= 500 ? 502 : upstream.status).json({
        error: result.error?.message || 'The image service rejected this preview request.',
      });
    }

    const imageBase64 = result.data?.[0]?.b64_json;
    if (!imageBase64) {
      return res.status(502).json({ error: 'The image service returned an empty result.' });
    }

    return res.status(200).json({
      imageDataUrl: 'data:image/jpeg;base64,' + imageBase64,
    });
  } catch {
    return res.status(502).json({ error: 'Could not connect to the AI image service. Please try again.' });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};
