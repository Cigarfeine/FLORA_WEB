# Phase 2: Ultra-Granular Component Micro-Analysis

> **File:** `audit/02_MICRO_ANALYSIS_CORE_COMPONENTS.md`  
> **Target Scope:** Line-by-Line Micro-Analysis of Core Architectural Components  
> **Methodology:** `audit-context-building` Protocol (First Principles, 5 Whys, 5 Hows, Line Citations, Invariants, Assumptions)

---

## Component 1: `CartProvider` (`src/context/CartContext.tsx`)

### 1. Purpose
The `CartProvider` component serves as the commercial and state transactional backbone of the Flora application. It encapsulates the shopping bag lifecycle, guarantees client-side cart persistence across browser reloads via `localStorage`, computes real-time delivery fee thresholds, and serializes commercial orders into URL-encoded WhatsApp messages. Without this component, visitors cannot accumulate items or initiate transactional contact with the physical atelier.

### 2. Inputs & Assumptions
- **Props (`children`):** Implicit React node tree. Assumes `children` will consume `useCart()` within this provider boundary.
- **Environment (`localStorage`):** Assumes the browser supports `window.localStorage` and that privacy mode does not disable storage writes.
- **Data Dependency (`FLORA_INFO`):** Depends on `catalog.ts` exporting a valid phone number string `FLORA_INFO.whatsappRaw` consisting only of numbers with country code (`919847000305`).
- **Catalog Trust:** Assumes all `Product` objects passed to `addItem` possess a unique string `id`, a non-negative numerical `price`, and a valid string `name`.
- **Preconditions:** Initial render must safely handle absent or corrupt storage without crashing the page.

### 3. Outputs & Effects
- **Context Value:** Provides `{ items, isOpen, setIsOpen, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal, freeDeliveryThreshold, deliveryFee, totalAmount, generateWhatsAppOrderUrl }`.
- **State Writes:** Updates `items` state and triggers `localStorage.setItem('flora_cart_items_v1', ...)`.
- **UI Side Effects:** Modifies `isOpen = true` upon adding items to trigger drawer opening.
- **External Hand-off:** Produces a formatted `https://wa.me/...` URL ready for external browser navigation.

### 4. Block-by-Block & Line-by-Line Micro-Analysis

```
Lines 28-35: Storage Hydration Hook
```
- **What it does:** Executes lazy state initialization for `items`. Reads `localStorage.getItem('flora_cart_items_v1')`, parses JSON, or falls back to `[]`.
- **Why here:** Placing this inside the `useState` callback ensures synchronous initialization before the initial render pass, eliminating flash of empty cart content.
- **Assumptions:** Stored data is an array of `CartItem` shapes.
- **First Principles Analysis:** A client-side shopping bag without authentication requires durable persistence. The browser's `localStorage` is synchronous and key-value based. Reading it lazily inside `useState(() => ...)` runs exactly once on mount, avoiding unnecessary disk reads on subsequent re-renders.
- **5 Whys (Defensive Storage):**
  1. *Why wrap JSON.parse in try/catch?* Because `localStorage` can contain arbitrary malformed strings if edited by user or corrupted.
  2. *Why return `[]` on error?* To ensure `items` remains a valid array so downstream `.map()` and `.reduce()` never crash.
  3. *Why use lazy initial state?* Because parsing large JSON strings on every component re-render wastes CPU cycles.
  4. *Why version the storage key (`_v1`)?* To prevent conflicts if cart item data schemas evolve in future releases.
  5. *Why isolate persistence from external servers?* Because Flora operates as a lean boutique atelier without backend database overhead.

```
Lines 39-45: Storage Synchronization Effect
```
- **What it does:** Calls `localStorage.setItem` inside a `useEffect` whenever `items` mutates.
- **Why here:** Decouples state setting from disk writing, executing storage persistence after React commits changes to the DOM.
- **Assumptions:** Storage quota (usually 5MB) is not exceeded by the cart array.

```
Lines 47-60: Deduplicated Insertion Logic (`addItem`)
```
- **What it does:** Scans `prev` for an existing item with matching `product.id`. If found, increments `quantity + 1` and updates `selectedPotColor`. If not found, appends `{ product, quantity: 1, selectedPotColor }`.
- **Why here:** Ensures items with the same product identity are merged into a single entry rather than creating duplicate row entries in the bag.
- **5 Hows (Cart Insertion):**
  1. *How does it identify duplicates?* Compares `item.product.id === product.id`.
  2. *How does it preserve custom pot colors?* Applies `selectedPotColor: selectedPotColor || item.selectedPotColor`.
  3. *How does it alert the user?* Calls `setIsOpen(true)` immediately after updating state.
  4. *How does it ensure concurrency safety?* Uses functional state update `setItems(prev => ...)`.
  5. *How does it avoid array mutation?* Uses `.map()` and array spread (`[...prev, ...]`) to guarantee reference immutability.

```
Lines 66-78: Delta Quantity Mutation (`updateQuantity`)
```
- **What it does:** Calculates `newQty = item.quantity + delta`. If `newQty > 0`, updates quantity; if `newQty <= 0`, returns `null`, followed by `.filter(Boolean)`.
- **Why here:** Provides a unified pipeline for both incrementing and decrementing, eliminating the need for a separate "decrement or remove" function.

```
Lines 84-87: Commercial Financial Math
```
- **What it does:** Calculates `totalItems`, `subtotal`, `deliveryFee`, and `totalAmount`.
- **Why here:** Pure derivation on render guarantees these values are always mathematically synchronized with `items`.

```
Lines 89-119: WhatsApp Protocol Serializer (`generateWhatsAppOrderUrl`)
```
- **What it does:** Formats a multi-line message containing itemized lines, subtotal, delivery status, optional customer details, and returns an encoded `wa.me` URL.
- **Why here:** Decouples checkout representation from third-party payment gateways, directing order intent straight to store personnel.

### 5. Quality Thresholds Verification
- **Invariants Established:**
  1. `items` is strictly always an Array (`Array.isArray(items) === true`).
  2. `totalItems === items.reduce((sum, item) => sum + item.quantity, 0)`.
  3. `deliveryFee === (subtotal >= 999 || subtotal === 0 ? 0 : 80)`.
  4. `totalAmount === subtotal + deliveryFee`.
- **Assumptions Documented:**
  1. `localStorage` is accessible and within storage quotas.
  2. Products have non-negative prices.
  3. `FLORA_INFO.whatsappRaw` is an active WhatsApp account.
  4. React tree will not invoke `useCart()` outside `CartProvider`.
  5. The client device has a browser capable of opening `wa.me` links.
- **External Risk Analysis:**
  1. *Risk:* User disables storage / incognito mode blocks storage. *Outcome:* Try/catch prevents crash, session cart works in memory only.
  2. *Risk:* WhatsApp URL length exceeds URL limits (approx 2000 chars) for giant orders. *Outcome:* May truncate in old browsers.
  3. *Risk:* Product price altered client-side. *Outcome:* Store staff verifies all totals manually on WhatsApp before dispatch.

---

## Component 2: `HeroSection` (`src/components/HeroSection.tsx`)

### 1. Purpose
The `HeroSection` is the premier interactive showpiece of the website. It houses the monumental brand statement (`BOTANICAL IS OUR CRAFT.`), the interactive 4-card fanned video deck, the 4.5-second cycling carousel state machine, and the GSAP ScrollTrigger FLIP scrub animation that transitions the hero cards into the 4-column Selected Work grid upon downward scroll.

### 2. Inputs & Assumptions
- **Catalog Assets:** Relies on `PRODUCTS` and `VIDEO_REELS` arrays in `src/data/catalog.ts`.
- **Screen Media Query:** Assumes desktop viewport is `>= 1024px` (`gsap.matchMedia('(min-width: 1024px)')`).
- **DOM Stability:** Assumes `cardRefs` and `targetSlotRefs` elements are mounted and measurable in the layout tree before scroll triggers.
- **Browser Autoplay Policies:** Assumes video playback requires `muted={true}` and `playsInline={true}` for unmuted browser auto-start.

### 3. Outputs & Effects
- **GSAP Scroll Scrub:** Animates CSS transforms (`x`, `y`, `scale`) on 4 video card elements across scroll delta between Hero and Selected Work.
- **Video DOM Mutators:** Direct ref calls to `video.play()` and `video.pause()`.
- **State Writes:** Controls `activeReelIndex`, `isPlaying`, `isMuted`, and `isScrolled`.

### 4. Block-by-Block & Line-by-Line Micro-Analysis

```
Lines 96-113: Card Switcher (`selectCard`)
```
- **What it does:** Updates `activeReelIndex`, triggers a squash/bounce elastic timeline on `deckRef`, and enforces that all 4 videos remain playing.
- **Why here:** Provides tactile physical feedback when switching cards while preventing inactive video freezes.
- **5 Whys (Concurrent Playback):**
  1. *Why call play() on all 4 videos?* Because in the previous design, selecting a card paused the others, breaking the vibrant continuous motion seen on New Engen.
  2. *Why catch errors on vid.play()?* Because browsers reject `.play()` promises if user interaction has not occurred yet.
  3. *Why animate deckRef scale down to 0.97 then 1.0?* To create the tactile "squash and stretch" physics of physical pottery cards.
  4. *Why elastic.out(1, 0.7)?* Matches the spring dampening curve reverse-engineered from New Engen.
  5. *Why run this in useCallback?* Prevents recreation of the handler across renders, stabilizing child component bindings.

```
Lines 116-142: Video Mount & Visibility Manager
```
- **What it does:** Initializes all video refs with `muted = isMuted` and calls `.play()`. Binds listeners to `document.visibilitychange` and `window.focus`.
- **Why here:** Browsers suspend background video rendering when switching tabs. This re-synchronizes video playback the instant the user returns to the Flora tab.

```
Lines 145-151: 4.5-Second Carousel Cycle
```
- **What it does:** Increments `activeReelIndex = (prev + 1) % 4` on an interval when `!isScrolled`.
- **Why here:** Showcases all 4 signature atelier curations automatically to passive visitors.
- **Invariant:** When `isScrolled === true` (user has scrolled into Selected Work), the interval is halted to prevent cards jumping while the user inspects the grid.

```
Lines 179-242: GSAP Scroll FLIP Scrub Architecture
```
- **What it does:** In desktop viewports (`min-width: 1024px`), clears previous transforms, measures clean bounding rects of hero cards and target grid slots, computes delta `(deltaX, deltaY, scale)`, and attaches a scrubbed ScrollTrigger timeline from `top top` to `top 120px`.
- **Why here:** Creates the fluid morph where cards fly out of the fanned hero deck directly into the 4 columns of the Selected Work section.
- **First Principles Analysis:** True FLIP (First, Last, Invert, Play) requires measuring elements in their un-transformed geometric states. If transforms are active during measurement, deltas compound and drift. Clearing props (`gsap.set(c, { clearProps: 'all' })`) prior to `getBoundingClientRect()` guarantees exact target positioning regardless of scroll speed.

```
Lines 430-447: Arched Mountain Peak Cutaway Badge
```
- **What it does:** Renders a custom SVG path (`M 0 140 L 0 115 L 160 26 C 172 16, 188 16, 200 26 L 360 115 L 360 140 Z`) filled with Chalk Cream (`#FAF2E8`).
- **Why here:** Emulates the distinctive New Engen bottom card cutaway dome shape, framing the plant's performance metrics (`Kerala Tested • -44% Heat Retention`).

### 5. Quality Thresholds Verification
- **Invariants Established:**
  1. `0 <= activeReelIndex < curations.length` (strictly within bounds `[0, 3]`).
  2. All videos maintain `muted === true` on initial load to pass browser autoplay security policies.
  3. FLIP timeline is cleaned up via `mm.revert()` when screen width falls below `1024px`.
- **Assumptions Documented:**
  1. Video URLs hosted on Wix CDN are accessible and respond with `Content-Type: video/mp4`.
  2. Target slots exist in the DOM with non-zero dimensions.
  3. Viewport width remains stable or triggers resize listener for recalculation.
  4. Active card has z-index `30` while inactive cards cascade from `20 - idx`.
  5. GSAP matchMedia correctly isolates desktop FLIP from mobile vertical flow.
- **External Risk Analysis:**
  1. *Risk:* Video file fails to load / network stalls. *Outcome:* `posterUrl` image displays as graceful static fallback.
  2. *Risk:* High GPU memory pressure on low-end devices running 4 concurrent videos. *Outcome:* Videos are 480p/720p compressed MP4s, hardware accelerated via `.will-change-transform`.
  3. *Risk:* Resize during active scrub. *Outcome:* `ScrollTrigger.refresh()` recalculates bounding rects.

---

## Component 3: `ServicesSection` (`src/components/ServicesSection.tsx`)

### 1. Purpose
The `ServicesSection` communicates Flora's five core botanical disciplines: Indoor Greenery Curation, Bespoke Planter Fabrication, Balcony & Commercial Staging, Zero-Maintenance Silk Botanicals, and White-Glove Repotting Clinic. It implements New Engen's `.acc-services` pattern: a 260vh sticky scroll scrub on desktop where scrolling locks the viewport and sequentially activates accordion tabs paired with large photographic evidence, while collapsing into an accessible vertical accordion list on mobile.

### 2. Inputs & Assumptions
- **Data Array (`services`):** 5 defined `ServiceItem` objects containing titles, taglines, descriptions, badges, tags, and Unsplash imagery.
- **DOM Anchors:** Requires `trackRef` (container defining 260vh scroll height) and `stickyRef` (100vh pinned viewport).
- **Breakpoint Assumption:** Assumes sticky scrub applies strictly to `min-width: 1024px`.

### 3. Outputs & Effects
- **GSAP Pinning:** Pins `stickyRef` to the viewport top while user scrolls through 260vh of document space.
- **Index Scrubbing:** Converts scroll progress `self.progress` (`0.0` to `1.0`) into discrete integer index `activeIdx` (`0` to `4`).
- **DOM Mutations:** Height and opacity animations on active accordion content panels via Framer Motion's `AnimatePresence`.

### 4. Block-by-Block & Line-by-Line Micro-Analysis

```
Lines 80-102: ScrollTrigger Pinned Accordion Effect
```
- **What it does:** Binds `ScrollTrigger.create` with `pin: stickyRef.current`, `scrub: 0.5`, `start: 'top top'`, and `end: 'bottom bottom'`. Maps progress via `Math.min(Math.floor(progress * total), total - 1)`.
- **Why here:** Translates physical vertical scroll into a controlled slide presentation without changing pages.
- **5 Whys (Progress-to-Index Mapping):**
  1. *Why use Math.floor(progress * total)?* To partition the 260vh scroll track into 5 equal-height scrub zones.
  2. *Why wrap in Math.min(..., total - 1)?* To prevent boundary overflow when `progress === 1.0` (which would yield index `5`).
  3. *Why scrub: 0.5?* Introduces 0.5 seconds of smooth damping, preventing accordion tabs from snapping abruptly during fast wheel spins.
  4. *Why isolate in gsap.context()?* Guarantees all created ScrollTriggers are killed and unpinned when the component unmounts (`ctx.revert()`).
  5. *Why disable on mobile (`< 1024px`)?* Because pinned viewports break natural touch scrolling on short mobile screens.

```
Lines 122-127: Dual-Mode Layout Track
```
- **What it does:** Assigns `h-auto lg:h-[260vh]` to the track, and `lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden` to the viewport.
- **Why here:** Automatically shifts between fluid mobile document flow and pinned desktop presentation using CSS classes.

```
Lines 140-160: Desktop Manual Override Click
```
- **What it does:** Allows clicking any accordion row directly to open it immediately, setting `activeIdx = index`.
- **Why here:** Provides power-user accessibility so visitors do not have to scrub with the mouse wheel to view a specific service.

### 5. Quality Thresholds Verification
- **Invariants Established:**
  1. `0 <= activeIdx <= services.length - 1`.
  2. Exactly one service tab is active at any given moment.
  3. On desktop, container track height is strictly proportional to service count (`260vh`).
- **Assumptions Documented:**
  1. `window.matchMedia('(min-width: 1024px)')` correctly evaluates viewport capabilities.
  2. GSAP plugin `ScrollTrigger` is registered globally.
  3. Track element has sufficient document scroll room beneath it to scrub to completion.
  4. Images on Unsplash respond within normal network latency.
  5. Hardware supports CSS sticky positioning.
- **External Risk Analysis:**
  1. *Risk:* Rapid window resizing across 1024px threshold. *Outcome:* `ScrollTrigger.refresh()` and matchMedia cleanup prevents frozen pinned elements.
  2. *Risk:* Touch momentum scroll skipping intermediate tabs. *Outcome:* Discrete index math guarantees the final rested index matches the exact stopping point.
  3. *Risk:* Broken external image URL. *Outcome:* Text description and tags remain fully legible.

---

## Component 4: `PlantPotCustomizer` (`src/components/PlantPotCustomizer.tsx`)

### 1. Purpose
The `PlantPotCustomizer` (Interactive Matcher Studio) enables customers to pair living tropical houseplants with handcrafted sculptural vessels in a 2-step visual matrix. It computes real-time bundle pricing, applies an automatic 10% studio pairing discount, renders a composite live preview, and dispatches a synthetic custom product to the cart with particle celebration.

### 2. Inputs & Assumptions
- **Plant Data (`PLANT_OPTIONS`):** 4 curated species (Monstera, Fiddle Leaf, Snake Plant, Bonsai) with prices and care specs.
- **Pot Data (`POT_OPTIONS`):** 4 artisanal vessels (Jaguar Grey Marble, Terracotta Urn, Ivory Planter, Charcoal Basin) with material specs.
- **Cart Context:** Requires `addItem` from `useCart()`.
- **Canvas Confetti:** Assumes `canvas-confetti` library is installed and capable of injecting an overlay canvas into the document body.

### 3. Outputs & Effects
- **State Writes:** Controls `selectedPlant`, `selectedPot`, and `justAdded` feedback state.
- **Cart Mutation:** Creates a composite `Product` object and dispatches it via `addItem(comboProduct, selectedPot.colorName)`.
- **Visual Effects:** Triggers a dual-side multi-color confetti burst.

### 4. Block-by-Block & Line-by-Line Micro-Analysis

```
Lines 111-113: Bundle Discount Algorithm
```
- **What it does:** Computes `rawTotal = plant.price + pot.price`, `comboDiscount = Math.round(rawTotal * 0.1)`, and `finalComboPrice = rawTotal - comboDiscount`.
- **Why here:** Provides an automated 10% commercial incentive for purchasing a paired plant and pot together rather than separately.
- **First Principles Analysis:** Pricing calculations in JavaScript floats are susceptible to rounding errors (e.g. `0.1 * 1080 = 108.00000000000001`). Using `Math.round()` guarantees integer rupee precision for clean currency formatting in Indian Rupees (INR).
- **5 Hows (Discount Math):**
  1. *How is rawTotal computed?* By summing `selectedPlant.price + selectedPot.price`.
  2. *How is the discount isolated?* By taking 10% (`rawTotal * 0.1`) and rounding to nearest whole rupee.
  3. *How is final price derived?* Subtraction: `rawTotal - comboDiscount`.
  4. *How is it reflected in UI?* Shows crossed-out original price (`line-through ₹{rawTotal}`) next to highlighted final price (`₹{finalComboPrice}`).
  5. *How is it preserved in Cart?* Passes `originalPrice: rawTotal` so the cart receipt shows the exact savings.

```
Lines 115-133: Synthetic Product Dispatch (`handleAddComboToCart`)
```
- **What it does:** Synthesizes an on-the-fly `Product` object:
  ```typescript
  id: `combo-${selectedPlant.id}-${selectedPot.id}`,
  name: `${selectedPlant.name} + ${selectedPot.name}`,
  category: 'plants',
  price: finalComboPrice,
  originalPrice: rawTotal,
  badge: 'Bespoke Combo',
  ```
- **Why here:** Allows the customizer to interface cleanly with the standard cart without requiring a specialized "combo" table or backend product creation.

```
Lines 131-133: Confetti & Transient State
```
- **What it does:** Fires confetti cannons from both sides (`origin: { x: 0.2, y: 0.6 }` and `{ x: 0.8, y: 0.6 }`), sets `justAdded = true`, and reverts it after 1500ms.
- **Why here:** Delivers psychological positive reinforcement upon completing a bespoke creation.

### 5. Quality Thresholds Verification
- **Invariants Established:**
  1. `finalComboPrice === (plant.price + pot.price) - Math.round((plant.price + pot.price) * 0.1)`.
  2. Synthetic ID is uniquely reproducible for any given pair: `combo-${plant.id}-${pot.id}`.
  3. `selectedPlant` and `selectedPot` are never `null` or `undefined`.
- **Assumptions Documented:**
  1. All plant and pot option prices are positive integers.
  2. The 10% discount rate is a fixed atelier commercial policy.
  3. Cart drawer accepts dynamic synthetic product IDs without catalog pre-registration.
  4. Browser environment allows dynamic DOM `<canvas>` injection by confetti.
  5. 1500ms is sufficient time for the user to read the "ADDED TO BAG" checkmark state.
- **External Risk Analysis:**
  1. *Risk:* Rapid clicking on "Add Custom Pair". *Outcome:* `addItem` increments quantity of the same combo ID idempotently without creating duplicate lines.
  2. *Risk:* Confetti library fails in restricted iframe. *Outcome:* Cart addition completes regardless since confetti is wrapped in independent execution.
  3. *Risk:* Currency exchange / fractional cents. *Outcome:* Application operates strictly in integer INR.

---

## Component 5: `Navbar` (`src/components/Navbar.tsx`)

### 1. Purpose
The `Navbar` provides the top-level navigational orientation and responsive control bar across the entire experience. It implements New Engen's signature morphing pill architecture: starting as a wide transparent header with unadorned typography at scroll position 0, and transitioning smoothly at `scrollY > 50` into floating 44px (`h-11`) squircle and capsule pills with active section telemetry tracking.

### 2. Inputs & Assumptions
- **Cart Context:** Consumes `totalItems` and `setIsOpen` from `useCart()`.
- **DOM Anchors:** Assumes target section elements exist in the DOM with IDs: `'curations'`, `'services'`, `'collection'`, `'studio'`, `'reels'`, `'care'`, `'location'`.
- **Scroll Dependency:** Listens to global `window.scrollY`.

### 3. Outputs & Effects
- **State Writes:** Controls `scrolled`, `mobileMenuOpen`, `activeSectionTitle`, and `isDarkSection`.
- **DOM Mutations:** Toggles fixed position classes, container paddings, background colors, and morphing logo width.
- **Cart Trigger:** Toggles `setIsOpen(true)` when shopping bag icon is clicked.

### 4. Block-by-Block & Line-by-Line Micro-Analysis

```
Lines 14-48: Scroll Position & Section Detector Hook
```
- **What it does:** Binds a passive scroll listener. Computes `scrollY > 50` to set `scrolled`. Iterates backward through 7 section descriptors, evaluates `el.getBoundingClientRect().top <= 140`, and sets `activeSectionTitle` and `isDarkSection`.
- **Why here:** Keeps the fixed header label synchronized with the exact section currently passing beneath the header.
- **5 Whys (Reverse Section Loop):**
  1. *Why iterate backward (`i = sections.length - 1; i >= 0; i--`)?* Because as user scrolls down, lower sections meet the threshold. Checking from bottom up finds the deepest entered section first.
  2. *Why threshold `rect.top <= 140`?* Because the header sits at the top; 140px accommodates header height plus generous visual padding before declaring a section active.
  3. *Why check `isDark`?* To adapt header text color between Chalk Cream on dark sections and Charcoal on light sections.
  4. *Why use `{ passive: true }`?* Informs the browser the listener will never call `preventDefault()`, allowing frictionless 60/120fps scrolling.
  5. *Why call handleScroll() immediately on mount?* To ensure correct state if the page loads or refreshes already scrolled down.

```
Lines 70-99: Morphing Brand Identity (Logo Emblem)
```
- **What it does:** When `scrolled === false`, displays the emblem with text wordmark (`FLORA / POTS & PLANTS • KERALA`). When `scrolled === true`, smoothly clips text to `max-w-0 opacity-0` and encapsulates the emblem in a 44px dark squircle badge (`w-11 h-11 rounded-2xl bg-ngen-charcoal`).
- **Why here:** Replicates New Engen's spatial economy: maximum brand presence on hero entrance, minimal non-obtrusive navigation during content reading.

```
Lines 102-116: Scrolled Center Header Title
```
- **What it does:** Fades in an uppercase monospace indicator (`text-[11px] font-mono font-bold`) showing the current section name (e.g. `SELECTED WORK`, `SERVICES & CRAFT`).
- **Why here:** Direct parity with New Engen layout discovered in `media_1793382277080.png`.

```
Lines 122-142: Links Capsule Pill
```
- **What it does:** Groups navigation links inside a unified 44px Dark Slate Pine (`#334238`) capsule (`h-11 px-7 rounded-full bg-ngen-green text-ngen-cream`).
- **Why here:** Prevents loose text from clashing with background imagery as content scrolls underneath.

### 5. Quality Thresholds Verification
- **Invariants Established:**
  1. All primary interactive header components maintain uniform 44px height (`h-11`) in scrolled state.
  2. Header container strictly adheres to `.site-max` fluid horizontal margins.
  3. Shopping bag counter badge is rendered if and only if `totalItems > 0`.
- **Assumptions Documented:**
  1. Section DOM IDs are unique and present in the page template.
  2. Mobile menu closes upon link selection (`onClick={() => setMobileMenuOpen(false)}`).
  3. Header maintains `z-40` layer, below preloader (`z-[99999]`) and drawer (`z-50`).
  4. Passive scroll listener does not block main thread.
  5. Browser supports CSS `cubic-bezier(0.19, 1, 0.22, 1)`.
- **External Risk Analysis:**
  1. *Risk:* Target section element deleted from DOM. *Outcome:* `if (el)` check prevents null dereference errors.
  2. *Risk:* Rapid scrolling past multiple sections in 1 frame. *Outcome:* Reverse loop catches latest section cleanly.
  3. *Risk:* Long section title on narrow screens. *Outcome:* Center title is hidden on mobile screens (`hidden md:flex`).
