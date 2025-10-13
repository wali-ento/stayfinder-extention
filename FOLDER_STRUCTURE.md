# 📁 StayFinder Extension - Complete Folder Structure

## 🎯 Visual Structure

```
d:\wxt\
│
├── entrypoints\                      # Extension entry points
│   ├── content.ts                   ⭐ SIMPLIFIED (8 lines)
│   ├── background.ts                Background script
│   └── popup\                       Extension popup
│
├── content\                          ⭐ NEW ORGANIZED STRUCTURE
│   │
│   ├── index.ts                     🎯 Main orchestrator
│   ├── README.md                    📚 Complete documentation
│   │
│   ├── styles\                      🎨 GLOBAL STYLES (REUSABLE)
│   │   ├── button.css              ⭐ All button styles here!
│   │   ├── theme.ts                Theme variables (colors, shadows)
│   │   └── index.ts                Style injection logic
│   │
│   ├── components\                  🧩 REUSABLE UI COMPONENTS
│   │   ├── Button.ts               ⭐ Creates buttons for ALL sites
│   │   ├── StatusIndicator.ts      Status indicator component
│   │   └── index.ts                Component exports
│   │
│   ├── sites\                       🌐 SITE-SPECIFIC LOGIC
│   │   └── airbnb\                 Airbnb implementation
│   │       ├── config.ts           Selectors & URL patterns
│   │       ├── extractors.ts       Extract listing IDs
│   │       ├── injectors.ts        Inject buttons (uses global)
│   │       └── index.ts            AirbnbHandler class
│   │   
│   │   [Future: vrbo/]              VRBO implementation
│   │   [Future: booking/]           Booking.com implementation
│   │
│   ├── core\                        ⚙️ CORE FUNCTIONALITY
│   │   └── observer.ts             MutationObserver setup
│   │
│   └── utils\                       🔧 UTILITY FUNCTIONS
│       ├── dom.ts                  DOM helpers (find elements)
│       ├── price.ts                Price calculations
│       └── index.ts                Utility exports
│
├── assets\                          Static assets
├── public\                          Public files
├── package.json
└── wxt.config.ts
```

## 🔗 How Files Connect

### 1️⃣ Entry Flow
```
User visits Airbnb
    ↓
entrypoints/content.ts (matches URL)
    ↓
content/index.ts (initContentScript)
    ↓
┌─────────────────────────────────────┐
│ 1. Inject global styles            │ → content/styles/button.css
│ 2. Create Airbnb handler           │ → content/sites/airbnb/index.ts
│ 3. Setup observer                  │ → content/core/observer.ts
│ 4. Show status indicator           │ → content/components/StatusIndicator.ts
└─────────────────────────────────────┘
```

### 2️⃣ Button Creation Flow
```
Airbnb handler runs
    ↓
sites/airbnb/injectors.ts
    ↓
Calls: createListingButton()
    ↓
components/Button.ts
    ↓
Creates <div> with class: "stayfinder-listing-button"
    ↓
Styled by: styles/button.css
    ↓
Button appears on page! ✨
```

## 📦 File Details

### Core Files (You'll Use These Most)

| File | Lines | Purpose |
|------|-------|---------|
| `content/index.ts` | ~30 | Main entry - orchestrates everything |
| `content/styles/button.css` | ~60 | ⭐ **All button styles** |
| `content/components/Button.ts` | ~70 | ⭐ **Button creator** |

### Site-Specific Files (Copy for New Sites)

| File | Lines | Purpose |
|------|-------|---------|
| `sites/airbnb/config.ts` | ~15 | Selectors & patterns |
| `sites/airbnb/extractors.ts` | ~30 | Extract listing IDs |
| `sites/airbnb/injectors.ts` | ~60 | Inject buttons |
| `sites/airbnb/index.ts` | ~40 | Handler class |

### Utility Files (Helper Functions)

| File | Lines | Purpose |
|------|-------|---------|
| `utils/dom.ts` | ~30 | Find elements in DOM |
| `utils/price.ts` | ~5 | Calculate savings |
| `core/observer.ts` | ~25 | Watch for DOM changes |

## 🎨 Global vs Site-Specific

### ⭐ GLOBAL (Shared by ALL Sites)

```typescript
// These work for Airbnb, VRBO, Booking.com, etc.

content/styles/button.css          // Button appearance
content/components/Button.ts       // Button creation
content/utils/dom.ts              // DOM helpers
content/core/observer.ts          // Mutation observer
```

### 🌐 SITE-SPECIFIC (Only for Airbnb)

```typescript
// These only apply to Airbnb

content/sites/airbnb/config.ts     // Airbnb selectors
content/sites/airbnb/extractors.ts // Airbnb URL patterns
content/sites/airbnb/injectors.ts  // Where to inject on Airbnb
```

## 🚀 Adding a New Site

### Copy This Pattern

```
content/sites/vrbo/              ← Create new folder
├── config.ts                   ← Copy from airbnb, change selectors
├── extractors.ts               ← Copy from airbnb, change patterns
├── injectors.ts                ← Copy from airbnb (uses SAME components!)
└── index.ts                    ← Copy from airbnb, rename class
```

### The Magic ✨

**You DON'T need to copy:**
- ❌ Button styles (already global in `styles/button.css`)
- ❌ Button components (already global in `components/Button.ts`)
- ❌ DOM utilities (already in `utils/dom.ts`)
- ❌ Observer logic (already in `core/observer.ts`)

**You ONLY need to define:**
- ✅ VRBO selectors (where are the listings?)
- ✅ VRBO URL patterns (how to extract IDs?)
- ✅ Injection points (where to add buttons?)

## 📊 File Size Comparison

### Before Refactoring
```
entrypoints/content.ts: 324 lines 😰
```

### After Refactoring
```
entrypoints/content.ts:           8 lines  ✅
content/index.ts:                30 lines  ✅
content/styles/button.css:        60 lines  ✅
content/components/Button.ts:     70 lines  ✅
content/sites/airbnb/config.ts:   15 lines  ✅
content/sites/airbnb/extractors:  30 lines  ✅
content/sites/airbnb/injectors:   60 lines  ✅
content/sites/airbnb/index.ts:    40 lines  ✅
content/utils/dom.ts:             30 lines  ✅
content/utils/price.ts:            5 lines  ✅
content/core/observer.ts:         25 lines  ✅
─────────────────────────────────────────────
Total: 373 lines (split across 11 files)
```

**Result:** Slightly more code, but **MUCH** more organized! 🎉

## 💡 Quick Tips

### Want to change button color?
```css
/* Edit: content/styles/button.css */
.stayfinder-listing-button {
  background: red !important;  /* ← All sites change */
}
```

### Want to add VRBO?
```bash
# 1. Copy folder
cp -r content/sites/airbnb content/sites/vrbo

# 2. Edit files in content/sites/vrbo/
# 3. Update content/index.ts
# 4. Done!
```

### Want to change button text?
```typescript
// Edit: content/components/Button.ts
button.innerHTML = `🎉 Save $${savings}`;  // ← All sites change
```

### Want to log more info?
```typescript
// Edit: content/utils/logger.ts (create if needed)
export function log(message: string) {
  console.log(`[StayFinder] ${message}`);
}
```

## ✅ Verification

Check if structure is correct:
```powershell
tree /F content
```

Expected output:
```
content
├── components
│   ├── Button.ts
│   ├── index.ts
│   └── StatusIndicator.ts
├── core
│   └── observer.ts
├── sites
│   └── airbnb
│       ├── config.ts
│       ├── extractors.ts
│       ├── index.ts
│       └── injectors.ts
├── styles
│   ├── button.css
│   ├── index.ts
│   └── theme.ts
├── utils
│   ├── dom.ts
│   ├── index.ts
│   └── price.ts
├── index.ts
└── README.md
```

✅ **All files created successfully!**

---

## 🎯 Summary

- **Global styles** in `content/styles/` → Used by ALL sites
- **Reusable components** in `content/components/` → Used by ALL sites
- **Site logic** in `content/sites/airbnb/` → Only Airbnb-specific
- **Utilities** in `content/utils/` → Helper functions
- **Entry point** in `entrypoints/content.ts` → Minimal (8 lines)

**Your extension is now scalable and maintainable! 🚀**

