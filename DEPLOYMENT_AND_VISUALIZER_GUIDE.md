# Flora Hybrid Room-Visualization Studio — Architecture & Deployment Guide

This guide documents the architecture, transparent asset pipeline, OpenAI API specification, and deployment steps for the **Hybrid Room-Visualization Studio** (`src/components/PlantPotCustomizer.tsx` + `api/visualize-room.ts`).

---

## 1. System Overview

The upgraded **Interactive Matcher & Room Visualizer Studio** combines two complementary modes inside `src/components/PlantPotCustomizer.tsx`:

1. **Client-Side Interactive HTML5 Canvas Compositor (Always Active, Zero External Dependencies)**:
   - Customers select from **6 living plants** (`monstera`, `fiddle`, `snake`, `bonsai`, `peace-lily`, `areca-palm`) and **4 architectural planters** (`jaguar-grey`, `terracotta-ribbed`, `ivory-fiber`, `charcoal-basin`) synced with `src/data/catalog.ts`.
   - Customers can upload their own **JPG, PNG, or WebP** room photograph (up to 10 MB, normalized client-side) or choose from built-in architectural Kerala room presets (*Kochi Teak Living Lounge* and *Panampilly Minimalist Study*).
   - Customers can drag to position, resize (`45%`–`175%`), rotate (`-45°` to `+45°`), flip horizontally, reset transforms, and download a crisp **1280×960 PNG** composition.
   - Preserves the **10% Studio Combo Discount**, **CartContext (`addItem`)** integration, and **WhatsApp (`+91 90747 97254`)** bespoke ordering.

2. **Optional AI Realistic Room Preview (`POST /api/visualize-room`)**:
   - Sends the uploaded room photograph, the composite placement guide image, and plant/pot metadata to a Vercel serverless function.
   - Uses OpenAI's official **`POST https://api.openai.com/v1/images/edits`** endpoint to blend the plant and pot into the room with realistic ambient/directional lighting, perspective alignment, and floor contact shadows while preserving the original room furniture and architecture.
   - If the AI backend is not configured or rate-limited, the UI displays a non-disruptive notice while keeping manual Canvas editing and PNG downloads 100% functional.

---

## 2. Transparent-Image Asset System & Fallbacks

Rectangular product photographs should never be overlaid directly onto customer room photographs. Flora uses a 3-tier transparent asset system implemented in `src/utils/transparentAssets.ts`:

1. **Tier 1 — Pre-Authored Multi-Layer Transparent SVG Cutouts (`public/assets/cutouts/`)**:
   - **Plants**:
     - `public/assets/cutouts/plants/monstera.svg`
     - `public/assets/cutouts/plants/fiddle.svg`
     - `public/assets/cutouts/plants/snake.svg`
     - `public/assets/cutouts/plants/bonsai.svg`
     - `public/assets/cutouts/plants/peace-lily.svg`
     - `public/assets/cutouts/plants/areca-palm.svg`
   - **Pots**:
     - `public/assets/cutouts/pots/jaguar-grey.svg`
     - `public/assets/cutouts/pots/terracotta-ribbed.svg`
     - `public/assets/cutouts/pots/ivory-fiber.svg`
     - `public/assets/cutouts/pots/charcoal-basin.svg`
   - Each pot cutout includes a recessed organic potting soil ellipse and upper rim lip so the plant stems nestle *inside* the pot opening during canvas compositing.

2. **Tier 2 — Automatic Client-Side Background Removal (`removeRectangularBackground`)**:
   - If a primary cutout asset fails to load, `loadTransparentAsset()` loads the product's fallback raster image onto an offscreen `<canvas>`, samples the corner studio background pixels, and strips the rectangular background using chroma-distance feathering.

3. **Tier 3 — Procedural Organic Cutout Fallback (`createProceduralFallbackCutout`)**:
   - If an external fallback image is blocked by CORS or offline, `loadTransparentAsset()` synthesizes a clean transparent botanical/planter silhouette on canvas so a rectangular box is never rendered.

---

## 3. Verified OpenAI Image Edit API Specification & Pricing

Verified against the official OpenAI API Reference (`https://developers.openai.com/api/reference/resources/images/methods/edit/index.md`) and Image Generation Guide (`https://developers.openai.com/api/docs/guides/image-generation.md`):

- **Endpoint**: `POST https://api.openai.com/v1/images/edits`
- **Supported Models**:
  - `gpt-image-2.5-sunburst` *(default — recommended by OpenAI for precision image editing)*
  - `gpt-image-2.5-flare` *(fast everyday generation/editing)*
  - `gpt-image-2`
  - `gpt-image-1.5`
  - `gpt-image-1-mini`
  - *Note*: `gpt-image-1` was deprecated and shut down by OpenAI on October 23, 2026.
- **Verified Request Parameters Used in `api/visualize-room.ts`**:
  - `model`: Configurable via `OPENAI_IMAGE_MODEL` (defaults to `gpt-image-2.5-sunburst`).
  - `images`: Array of `{ image_url: string }` containing the base64 data URL of the room photograph (`images[0]`) and the composite placement guide (`images[1]`).
  - `prompt`: Architectural preservation and lighting integration instructions.
  - `quality`: Configurable via `OPENAI_IMAGE_QUALITY` (`low`, `medium`, `high`, `auto`; defaults to `high`).
  - `size`: `"auto"` (preserves aspect ratio; also supports `"1024x1024"`, `"1536x1024"`, `"1024x1536"`).
  - `output_format`: `"png"`.
  - `moderation`: `"auto"`.
  - `safety_identifier`: Privacy-preserving FNV-1a hash of the client IP (`<= 128` chars, replacing the deprecated `user` parameter).
  - `input_fidelity`: Sent as `"high"` **only** when `model === "gpt-image-1.5"` (omitted on `gpt-image-2` and `gpt-image-2.5-*` per official API constraints).
- **Official Pricing Reference**:
  - **GPT Image 2.5 (`gpt-image-2.5-sunburst` / `gpt-image-2.5-flare`) & GPT Image 2**:
    - Text input tokens: `\$5.00 / 1M tokens`
    - Image input tokens: `\$8.00 / 1M tokens`
    - Image output tokens: `\$30.00 / 1M tokens` (approx. `\$0.005`–`\$0.006` for Low quality, `\$0.041`–`\$0.053` for Medium quality, `\$0.165`–`\$0.211` for High quality).
  - **GPT Image 1.5 (`gpt-image-1.5`)**:
    - Low: `\$0.009`–`\$0.013` per image | Medium: `\$0.034`–`\$0.050` per image | High: `\$0.133`–`\$0.200` per image.
  - **GPT Image 1 Mini (`gpt-image-1-mini`)**:
    - Low: `\$0.005`–`\$0.006` per image | Medium: `\$0.011`–`\$0.015` per image | High: `\$0.036`–`\$0.052` per image.

---

## 4. Deployment Instructions

### Part A — Deploying the Serverless Backend to Vercel

1. Import the `Cigarfeine/FLORA_WEB` repository into [Vercel](https://vercel.com/new).
2. Vercel automatically detects `vercel.json` and exposes `api/visualize-room.ts` at `POST /api/visualize-room`.
3. Configure the following **Environment Variables** in your Vercel Project Settings:

| Variable | Required | Description |
| :--- | :--- | :--- |
| `OPENAI_API_KEY` | **Yes** (for AI mode) | Server-side OpenAI API key (`sk-...`). Never exposed to the browser. |
| `OPENAI_IMAGE_MODEL` | Optional | Defaults to `gpt-image-2.5-sunburst`. Also accepts `gpt-image-2.5-flare`, `gpt-image-2`, `gpt-image-1.5`, or `gpt-image-1-mini`. |
| `OPENAI_IMAGE_QUALITY` | Optional | Defaults to `high`. Options: `low`, `medium`, `high`, `auto`. |
| `ALLOWED_ORIGINS` | **Recommended** | Comma-separated CORS origins: `https://cigarfeine.github.io,http://localhost:5173,http://localhost:4173` |
| `UPSTASH_REDIS_REST_URL` | Optional | Upstash Redis REST URL for distributed rate limiting (5 requests / 10 min per IP). Falls back to in-memory rate limiting if omitted. |
| `UPSTASH_REDIS_REST_TOKEN` | Optional | Upstash Redis REST Bearer token. |

4. Deploy the Vercel project and copy your production domain (for example, `https://flora-web-api.vercel.app`).

### Part B — Deploying the Frontend to GitHub Pages

1. The existing GitHub Pages workflow (`.github/workflows/deploy.yml`) builds and deploys the Vite frontend from `master` to the `gh-pages` branch.
2. To connect the static GitHub Pages frontend to your Vercel AI backend:
   - Go to **GitHub Repository Settings -> Secrets and variables -> Actions -> Variables**.
   - Add a repository variable or secret named `VITE_API_BASE_URL` set to your Vercel URL (e.g., `https://flora-web-api.vercel.app`).
   - If `VITE_API_BASE_URL` is omitted, the Manual Placement Canvas Editor, Sample Rooms, and PNG Download continue to work 100% client-side.
