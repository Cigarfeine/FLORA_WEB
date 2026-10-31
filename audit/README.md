# Flora Atelier: Audit & Context Building Master Index

> **Audit Mode:** Pure Context Building (Ultra-Granular Bottom-Up Architectural Mapping)  
> **Target Codebase:** Flora Pots & Plants Atelier (`/home/arshad/Projects/FLORA_WEBSITE`)  
> **Framework:** React 18 + TypeScript + Vite + Tailwind CSS + GSAP ScrollTrigger + Lenis Smooth Scroll + Framer Motion  
> **Standard:** `audit-context-building` Protocol (Zero premature vulnerability/exploit assumptions; first principles, 5 Whys, 5 Hows, line-by-line verification)

---

## Executive Summary & Scope

This documentation suite establishes a verified, line-by-line mental model of the Flora Botanical Atelier codebase. Following the strict rules of the `audit-context-building` methodology, this audit does **not** jump to vulnerability findings or fix proposals. Instead, it systematically deconstructs:
- Every data structure, storage variable, and implicit environment dependency.
- Every state mutation and transition lifecycle across components.
- The physics, scroll synchronization, and FLIP delta calculations governing GSAP and Lenis.
- The catalog representation, pricing mathematics, bundle generation, and WhatsApp order serialization.

---

## Document Index

| Document | Primary Scope | Key Modules & Topics Covered |
|---|---|---|
| **[`00_SYSTEM_ARCHITECTURE_AND_ORIENTATION.md`](./00_SYSTEM_ARCHITECTURE_AND_ORIENTATION.md)** | System Overview, Module Graph, Tokens & Entrypoints | `main.tsx`, `App.tsx`, `index.html`, `index.css`, `tailwind.config.js`, design tokens, viewport scaling (`.site-max`), hardware layers (`.gpu-layer`), actors. |
| **[`01_STATE_MANAGEMENT_AND_DATA_FLOW.md`](./01_STATE_MANAGEMENT_AND_DATA_FLOW.md)** | State Architecture, Storage & Event Flows | `CartContext.tsx`, `localStorage` key `flora_cart_items_v1`, `catalog.ts`, component state machine inventory, read/write matrices, and serialization pathways. |
| **[`02_MICRO_ANALYSIS_CORE_COMPONENTS.md`](./02_MICRO_ANALYSIS_CORE_COMPONENTS.md)** | Ultra-Granular Line-by-Line Micro-Analysis | `CartProvider`, `HeroSection`, `ServicesSection`, `PlantPotCustomizer`, `CatalogSection`, `Navbar`. Includes First Principles, 5 Whys, 5 Hows, assumptions, and invariant catalogs. |
| **[`03_GLOBAL_INVARIANTS_AND_WORKFLOW_RECONSTRUCTION.md`](./03_GLOBAL_INVARIANTS_AND_WORKFLOW_RECONSTRUCTION.md)** | System Workflows, Boundaries & Fragility Clusters | User journeys (Customizer, Catalog, Cart, WhatsApp Checkout), Lenis-GSAP render pipeline, Multi-stream video loop engine, Trust boundaries, and Fragility clusters. |

---

## Architectural Principles & Constraints Observed

1. **New Engen Visual & Fluid Architecture:**
   - 93.3% to 99.6% screen width utilization via fluid rem scaling (`.site-max`).
   - Dynamic fluid gutters: `clamp(1.25rem, 3.33vw, 4rem)`.
   - Strictly 0 emojis in markup, code, and UI copy.
   - Exact color token discipline (`#334238` Dark Green, `#242424` Charcoal, `#FAF2E8` Chalk Cream, `#FF9C94` Coral Peach, `#CCE561` Electric Lime).

2. **Decoupled E-Commerce Engine:**
   - Client-side headless shopping cart with zero external database dependencies.
   - Persistence layer via browser `localStorage`.
   - Order fulfillment handoff conducted through structured, URI-encoded WhatsApp conversational payloads targeting store operations in Nellikuzhi, Kerala (`+91 9847000305`).

3. **High-Performance Kinetic Animation Pipeline:**
   - Virtualized smooth scroll via Lenis synchronized to the `gsap.ticker`.
   - ScrollTrigger scrubbing with GSAP FLIP bounding-client-rect transformation deltas.
   - Multi-video parallel playback without mutual pause interruption.

---

## How to Navigate This Audit

To trace an execution path:
1. Start in [`00_SYSTEM_ARCHITECTURE_AND_ORIENTATION.md`](./00_SYSTEM_ARCHITECTURE_AND_ORIENTATION.md) for the high-level mount graph and environmental invariants.
2. Review [`01_STATE_MANAGEMENT_AND_DATA_FLOW.md`](./01_STATE_MANAGEMENT_AND_DATA_FLOW.md) to understand state dependencies before inspecting component logic.
3. Dive into [`02_MICRO_ANALYSIS_CORE_COMPONENTS.md`](./02_MICRO_ANALYSIS_CORE_COMPONENTS.md) for line-level logic proofs, invariants, and failure modes.
4. Conclude with [`03_GLOBAL_INVARIANTS_AND_WORKFLOW_RECONSTRUCTION.md`](./03_GLOBAL_INVARIANTS_AND_WORKFLOW_RECONSTRUCTION.md) to evaluate end-to-end user journeys and cross-module fragility clusters.
