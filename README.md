# FLORA POTS & PLANTS ATELIER

> Living botanicals and handcrafted designer pots curated for mindful homes and architectural spaces in Nellikuzhi, Kerala.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38b2ac.svg)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-3.15-88ce02.svg)](https://greensock.com/gsap/)
[![Lenis](https://img.shields.io/badge/Lenis-1.3-black.svg)](https://github.com/darkroomengineering/lenis)

---

## Overview

**Flora Pots & Plants** is a boutique digital experience engineered for a physical botanical atelier and ceramic pottery studio located in **Nellikuzhi, Kothamangalam, Kerala**.

The web experience pairs high-aesthetic editorial motion with an accessible, headless client-side e-commerce engine:
- **Spatial Alignment & Expansive Canvas:** Reverse-engineered fluid proportional rem scaling architecture (`.site-max`), spanning 93.3% to 99.6% of viewport width across modern displays with zero horizontal overflow on mobile.
- **Concurrent Video Loops:** Real-time synchronized playback across 4 high-definition showroom video reels simultaneously without mutual pause interrupts.
- **GSAP FLIP Scroll Alignment:** Un-transformed bounding-rect snapshotting that morphs hero cards dynamically into the 4-column Selected Work grid.
- **Interactive Matcher Studio:** 2-step bespoke plant-and-pot pairing customizer with live preview, automatic 10% combo discount math, and celebratory canvas confetti.
- **WhatsApp Fulfillment Pipeline:** Direct client-side serialization of the shopping bag into formatted, URL-encoded WhatsApp order receipts (`wa.me/919847000305`).

---

## Architectural Audit Documentation

A complete, ultra-granular architectural context-building audit adhering to the `audit-context-building` protocol is maintained in [`audit/`](./audit/):

- **[`audit/README.md`](./audit/README.md)** — Master Audit Index & Navigation Guide
- **[`audit/00_SYSTEM_ARCHITECTURE_AND_ORIENTATION.md`](./audit/00_SYSTEM_ARCHITECTURE_AND_ORIENTATION.md)** — Technology Stack, Entrypoints, Fluid Geometry & Design Tokens
- **[`audit/01_STATE_MANAGEMENT_AND_DATA_FLOW.md`](./audit/01_STATE_MANAGEMENT_AND_DATA_FLOW.md)** — CartContext State Machine, LocalStorage Persistence & Read/Write Matrix
- **[`audit/02_MICRO_ANALYSIS_CORE_COMPONENTS.md`](./audit/02_MICRO_ANALYSIS_CORE_COMPONENTS.md)** — Line-by-Line Micro-Analysis of Core Components (First Principles, 5 Whys, 5 Hows, Invariants)
- **[`audit/03_GLOBAL_INVARIANTS_AND_WORKFLOW_RECONSTRUCTION.md`](./audit/03_GLOBAL_INVARIANTS_AND_WORKFLOW_RECONSTRUCTION.md)** — Multi-Module Invariants, End-to-End User Journeys & Fragility Clusters

---

## Design System & Tokens

| Token | Hex | Role | Tailwind Class |
|---|---|---|---|
| **Base Pine** | `#334238` | Primary Dark Canvas & Pill Nav | `bg-ngen-green`, `text-ngen-green` |
| **Charcoal** | `#242424` | Contrast Squircle Badges & Text | `bg-ngen-charcoal`, `text-ngen-charcoal` |
| **Chalk Cream** | `#FAF2E8` | Light Canvas & Mountain Badges | `bg-ngen-cream`, `text-ngen-cream` |
| **Coral Peach** | `#FF9C94` | Primary Conversion CTAs | `bg-ngen-peach`, `text-ngen-peach` |
| **Electric Lime** | `#CCE561` | Metric Accents & Kinetic Crosshairs | `bg-ngen-lime`, `text-ngen-lime` |

> **Design Constraint:** Strictly zero emojis in code, markup, or copy. All visual indicators utilize custom SVG geometry or Lucide React icons.

---

## Tech Stack

- **Framework:** [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler:** [Vite 6](https://vitejs.dev/)
- **Styling:** [Tailwind CSS 3](https://tailwindcss.com/) + PostCSS
- **Animation & Motion:** [GSAP 3](https://greensock.com/gsap/) (ScrollTrigger) + [Framer Motion 12](https://www.framer.com/motion/)
- **Smooth Scroll:** [Lenis](https://github.com/darkroomengineering/lenis)
- **Effects & Icons:** [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) + [Lucide React](https://lucide.dev/)

---

## Getting Started

### Prerequisites
- Node.js `>= 18.0.0`
- npm `>= 9.0.0`

### Installation
```bash
git clone https://github.com/Cigarfeine/FLORA_WEB.git
cd FLORA_WEB
npm install
```

### Development Server
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

---

## Studio Coordinates

- **Address:** Appadath Building, Nellikuzhi, Kothamangalam, Kerala 686691
- **Direct Phone:** +91 9847000305 / +91 8606103314
- **WhatsApp:** +91 9847000305
- **Instagram:** [@flora__pots](https://www.instagram.com/flora__pots/)

---

## License

Private repository © Flora Pots & Plants Atelier. All rights reserved.
