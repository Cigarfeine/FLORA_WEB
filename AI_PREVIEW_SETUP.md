# Flora AI room preview setup

The manual room-placement editor runs in the browser and works on GitHub Pages. AI image generation requires a server-side API because the OpenAI key must never be placed in frontend code.

## 1. Deploy the API

Deploy this repository to Vercel, or copy `api/generate-preview.ts` into an equivalent serverless function on your preferred platform. The provided handler follows the Vercel Node function convention.

Set these environment variables in the API deployment:

- `OPENAI_API_KEY`: your secret OpenAI API key. Keep this server-side only.
- `ALLOWED_ORIGINS`: comma-separated exact origins permitted to call the API, for example `https://cigarfeine.github.io,http://localhost:5173`.

The handler uses the OpenAI Images edit endpoint and the `gpt-image-2.5-sunburst` model. The room image and two catalogue image URLs are sent as visual references. AI generation incurs API usage charges.

## 2. Point the website at the API

In the frontend build environment, set:

```env
VITE_AI_PREVIEW_API_URL=https://YOUR-VERCEL-PROJECT.vercel.app/api/generate-preview
```

For GitHub Pages, configure this variable in the build workflow before running `npm run build`. Rebuild and deploy the static site after changing the variable. Do not put `OPENAI_API_KEY` in any `VITE_` variable.

## 3. Test locally

Run the frontend with `npm run dev`. Add `http://localhost:5173` to `ALLOWED_ORIGINS` on the API deployment and set the frontend variable to the deployed API URL.

## 4. Production safeguards

Before enabling this endpoint for public traffic, configure provider-side rate limiting or an application rate limiter, usage budgets, and monitoring. CORS is a browser access control and is not an API abuse-prevention mechanism. Consider adding a CAPTCHA/Turnstile challenge if anonymous public access is enabled.

Uploaded room images are resized in the browser and are only sent to the AI endpoint when the visitor explicitly selects **Generate AI preview**. The function does not persist uploaded images or generated results. Do not log request bodies.
