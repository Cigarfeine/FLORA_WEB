# Phase 2: State Management & Data Flow Architecture

> **File:** `audit/01_STATE_MANAGEMENT_AND_DATA_FLOW.md`  
> **Target Scope:** State Machines, Storage Persistence, Read/Write Matrices, Serialization Pathways  
> **Status:** Complete (Fully Verified)

---

## 1. Global State Architecture: `CartContext.tsx`

The application's only global state layer is the `CartContext` (`src/context/CartContext.tsx`). It manages shopping bag contents, drawer visibility, delivery calculations, and checkout serialization.

### 1.1 State Variables & Initialization

```typescript
// src/context/CartContext.tsx Lines 28-37
const [items, setItems] = useState<CartItem[]>(() => {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
});

const [isOpen, setIsOpen] = useState(false);
```

| State Variable | Type | Default Value | Mutator Functions | Persistence |
|---|---|---|---|---|
| `items` | `CartItem[]` | Loaded from `localStorage['flora_cart_items_v1']` or `[]` | `addItem`, `removeItem`, `updateQuantity`, `clearCart` | Yes (`localStorage`) |
| `isOpen` | `boolean` | `false` | `setIsOpen` | No (in-memory) |

### 1.2 Computed Properties (Derived State)

The context derives four commercial values dynamically on every render without storing redundant state:

```typescript
// src/context/CartContext.tsx Lines 84-87
const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : STANDARD_DELIVERY_FEE;
const totalAmount = subtotal + deliveryFee;
```

#### Commercial Invariants:
1. **Free Delivery Threshold:** `FREE_DELIVERY_THRESHOLD = 999` INR. If `subtotal >= 999`, delivery fee is `0`.
2. **Empty Cart Zero Fee:** If `subtotal === 0`, delivery fee is strictly `0` (never charges delivery on an empty bag).
3. **Standard Delivery Fee:** If `0 < subtotal < 999`, delivery fee is strictly `80` INR.
4. **Total Amount Equation:** Always satisfies `totalAmount === subtotal + deliveryFee`.

---

## 2. Cart State Mutation Mechanics

### 2.1 `addItem(product: Product, selectedPotColor?: string)`
```typescript
// src/context/CartContext.tsx Lines 47-60
const addItem = (product: Product, selectedPotColor?: string) => {
  setItems(prev => {
    const existing = prev.find(item => item.product.id === product.id);
    if (existing) {
      return prev.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1, selectedPotColor: selectedPotColor || item.selectedPotColor }
          : item
      );
    }
    return [...prev, { product, quantity: 1, selectedPotColor }];
  });
  setIsOpen(true);
};
```
- **Idempotency & Deduplication:** Matches existing items strictly by `item.product.id`.
- **Side Effect:** Automatically sets `isOpen = true`, sliding open `CartDrawer` so the customer receives immediate visual confirmation of the addition.

### 2.2 `updateQuantity(productId: string, delta: number)`
```typescript
// src/context/CartContext.tsx Lines 66-78
const updateQuantity = (productId: string, delta: number) => {
  setItems(prev =>
    prev
      .map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean) as CartItem[]
  );
};
```
- **Auto-Pruning Invariant:** If `newQty <= 0` (e.g. quantity was `1` and user clicked minus), the item returns `null` and is filtered out of the array.

### 2.3 `generateWhatsAppOrderUrl(customerName, address, notes)`
```typescript
// src/context/CartContext.tsx Lines 89-119
// Constructs plain-text order receipt with item numbers, product names, pot color selections,
// subtotal, delivery fee, and customer details, then URI-encodes the string.
const fullMessage = lines.join('\n');
return `https://wa.me/${FLORA_INFO.whatsappRaw}?text=${encodeURIComponent(fullMessage)}`;
```
- **Target Number:** `919847000305` (`FLORA_INFO.whatsappRaw`).
- **Encoding Safety:** Passes through `encodeURIComponent`, escaping line breaks (`%0A`), asterisks, and special characters.

---

## 3. Local Component State Inventory

Every component in Flora maintains clear, isolated local state machines:

| Component | State Variables | Type | Initial Value | Trigger / Transition |
|---|---|---|---|---|
| **`Navbar.tsx`** | `scrolled`<br>`mobileMenuOpen`<br>`activeSectionTitle`<br>`isDarkSection` | `boolean`<br>`boolean`<br>`string`<br>`boolean` | `false`<br>`false`<br>`'SELECTED WORK'`<br>`false` | Window scroll > 50px.<br>Mobile hamburger click.<br>Bounding rect scan of 7 target section IDs.<br>Matches section's `isDark` flag. |
| **`HeroSection.tsx`** | `activeReelIndex`<br>`isPlaying`<br>`isMuted`<br>`isScrolled` | `number`<br>`boolean`<br>`boolean`<br>`boolean` | `0`<br>`true`<br>`true`<br>`false` | 4.5s setInterval OR user click on card/series tab.<br>User togglePlay button click.<br>User toggleMute button click.<br>ScrollTrigger `self.progress > 0.08`. |
| **`ServicesSection.tsx`**| `activeIdx` | `number` | `0` | ScrollTrigger scrub over 260vh track: `Math.floor(progress * 5)`. |
| **`CatalogSection.tsx`** | `activeCategory`<br>`searchQuery`<br>`sortBy`<br>`addedId` | `ProductCategory`<br>`string`<br>`string`<br>`string \| null` | `'all'`<br>`''`<br>`'default'`<br>`null` | Category pill click.<br>Search input `onChange`.<br>Sort select dropdown.<br>Product added to bag (1.2s timeout). |
| **`PlantPotCustomizer.tsx`**| `selectedPlant`<br>`selectedPot`<br>`justAdded` | `PlantOption`<br>`PotOption`<br>`boolean` | `PLANT_OPTIONS[0]`<br>`POT_OPTIONS[0]`<br>`false` | Plant thumbnail click.<br>Pot color swatch click.<br>Combo added to cart (1.5s timeout). |
| **`VideoReelsSection.tsx`**| `activeReelIndex`<br>`isPlaying`<br>`isMuted` | `number`<br>`boolean`<br>`boolean` | `0`<br>`true`<br>`true` | Thumbnail click.<br>Video click / play button.<br>Mute toggle button. |
| **`SocialProofSection.tsx`**| `activeCategory`<br>`currentQuoteIndex` | `string`<br>`number` | `'all'`<br>`0` | Pill click (resets quote index to 0).<br>Arrow buttons (modulo over filtered stories). |
| **`CareGuideSection.tsx`**| `openId` | `string` | `'watering'` | Accordion header click (`openId === id ? '' : id`). |
| **`CartDrawer.tsx`** | `customerName`<br>`address`<br>`notes` | `string`<br>`string`<br>`string` | `''`<br>`''`<br>`''` | Input field changes before WhatsApp checkout. |
| **`Preloader.tsx`** | `isDone` | `boolean` | `false` | 400ms entrance timeout. |

---

## 4. State Read/Write Matrix

```
Legend:
  [R] = Reads state
  [W] = Writes / Mutates state
```

| Component | `CartContext.items` | `CartContext.isOpen` | `CartContext.totalItems` | `CartContext.subtotal` | `localStorage` |
|---|---|---|---|---|---|
| `src/context/CartContext.tsx` | **[R/W]** | **[R/W]** | **[R/W]** | **[R/W]** | **[R/W]** |
| `src/components/Navbar.tsx` | - | **[W]** | **[R]** | - | - |
| `src/components/HeroSection.tsx` | - | **[W]** | - | - | - |
| `src/components/CatalogSection.tsx` | - | **[W]** | - | - | - |
| `src/components/PlantPotCustomizer.tsx`| - | **[W]** | - | - | - |
| `src/components/VideoReelsSection.tsx` | - | **[W]** | - | - | - |
| `src/components/CartDrawer.tsx` | **[R/W]** | **[R/W]** | **[R]** | **[R]** | - |
| `src/App.tsx` (`FloatingActions`) | - | **[W]** | **[R]** | - | - |

---

## 5. End-to-End Data Flow Diagram

```mermaid
flowchart TD
    subgraph Data Layer
        Catalog["catalog.ts (Static Products & Reels)"]
        LocalStorage[("localStorage: flora_cart_items_v1")]
    end

    subgraph State Orchestrator
        CartContext["CartContext (React Provider)"]
    end

    subgraph Consumer Components
        Navbar["Navbar (Emblem, 44px Pills, Bag Counter)"]
        Hero["HeroSection (FLIP Scrub & 4 Concurrent Reels)"]
        CatalogComp["CatalogSection (Search & Filtering)"]
        Customizer["PlantPotCustomizer (10% Bundle Pricing)"]
        ReelsComp["VideoReelsSection (Active 9:16 Reel)"]
        Drawer["CartDrawer (Free Delivery Meter & Inputs)"]
    end

    subgraph External Output
        WhatsApp["WhatsApp Web API (wa.me/919847000305)"]
    end

    Catalog --> Hero
    Catalog --> CatalogComp
    Catalog --> ReelsComp
    LocalStorage <-->|hydrate & persist| CartContext

    CatalogComp -->|addItem| CartContext
    Hero -->|addItem (scrolled)| CartContext
    Customizer -->|addItem (synthetic bundle)| CartContext
    ReelsComp -->|handleQuickAddReelItem| CartContext

    CartContext -->|totalItems| Navbar
    CartContext -->|items, subtotal, deliveryFee| Drawer
    Drawer -->|generateWhatsAppOrderUrl| WhatsApp
```

---

## 6. Storage Invariants & Security Boundaries

1. **Storage Isolation:** The cart key `'flora_cart_items_v1'` uses a unique versioned namespace to avoid colliding with other applications running on the same domain or origin.
2. **Resilience to Corrupt JSON:**
   ```typescript
   try {
     const saved = localStorage.getItem(CART_STORAGE_KEY);
     return saved ? JSON.parse(saved) : [];
   } catch {
     return [];
   }
   ```
   If a user alters `localStorage` with invalid JSON or if storage quotas are exceeded, the app falls back gracefully to `[]` without throwing an unhandled runtime exception.
3. **Synthetic Product ID Namespacing:** The `PlantPotCustomizer` constructs compound IDs in the format `combo-${plant.id}-${pot.id}` (e.g. `combo-monstera-jaguar-grey`). This prevents clashes with standard catalog items.
