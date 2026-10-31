# Flora Room-Visualization Studio — Architecture & Deployment Guide

This guide documents the architecture, transparent asset pipeline, client-side Canvas visualizer, and deployment procedures for the **Room-Visualization Studio** (`src/components/PlantPotCustomizer.tsx` and `src/utils/transparentAssets.ts`).

---

## 1. System Overview

The **Interactive Matcher & Room Visualizer Studio** is an entirely client-side, zero-dependency interactive tool embedded in `src/components/PlantPotCustomizer.tsx`:

1. **Client-Side Interactive HTML5 Canvas Compositor**:
   - Customers select from **6 living botanicals** (`monstera`, `fiddle`, `snake`, `bonsai`, `peace-lily`, `areca-palm`) and **4 architectural planters** (`jaguar-grey`, `terracotta-ribbed`, `ivory-fiber`, `charcoal-basin`) synchronized with `src/data/catalog.ts`.
   - Customers can upload their own **JPG, PNG, or WebP** room photograph (up to 10 MB, normalized client-side) or choose from architectural Kerala room presets (*Kochi Teak Living Lounge* and *Panampilly Minimalist Study*).
   - Customers can drag to position, resize (`45%` to `175%`), rotate (`-45 deg` to `+45 deg`), flip horizontally, reset transforms, and download a crisp **1280x960 PNG** composition.
   - Preserves the **10% Studio Combo Discount**, **CartContext (`addItem`)** integration, and **WhatsApp (`+91 90747 97254`)** bespoke ordering.
   - Runs 100% locally in the customer browser without third-party AI APIs or external server latency.

---

## 2. Transparent-Image Asset System & Fallbacks

Rectangular product photographs are never overlaid directly onto customer room photographs. Flora uses a 3-tier transparent asset system implemented in `src/utils/transparentAssets.ts`:

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
   - Each pot cutout includes a recessed organic potting soil ellipse and upper rim lip so plant stems nestle naturally *inside* the pot opening during canvas compositing.

2. **Tier 2 — Automatic Client-Side Background Removal (`removeRectangularBackground`)**:
   - If a primary cutout asset fails to load, `loadTransparentAsset()` loads the product's fallback raster image onto an offscreen `<canvas>`, samples the corner studio background pixels, and strips the rectangular background using chroma-distance feathering.

3. **Tier 3 — Procedural Organic Cutout Fallback (`createProceduralFallbackCutout`)**:
   - If an external fallback image is blocked by CORS or offline, `loadTransparentAsset()` synthesizes a clean transparent botanical/planter silhouette on canvas so a rectangular box is never rendered.

---

## 3. Non-AI E-Commerce Backend Readiness (Supabase)

In accordance with architectural decisions:
- All external AI integrations (OpenAI and Google Gemini APIs), serverless visualization endpoints, and AI SDK dependencies have been removed.
- The repository is prepared for the upcoming Supabase e-commerce backend (product management, customer orders, staff administration, APS branch-to-branch shipment management, and tracking).
- The environment configuration (`.env.example`) defines `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for connecting the frontend directly to the Supabase project.

---

## 4. Frontend Deployment Instructions (GitHub Pages)

1. The automated GitHub Pages workflow (`.github/workflows/deploy.yml`) builds and deploys the Vite frontend from `master` to the `gh-pages` branch.
2. Build command:
   ```bash
   npm run build
   ```
3. The resulting `dist/` directory contains standard static assets (`index.html`, JavaScript, CSS, and SVG cutouts) served via GitHub Pages.
4. When connecting to the Supabase backend:
   - Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in GitHub Repository Secrets / Variables.
