# StayFinder Content Script Architecture

This folder contains the organized content script code for the StayFinder extension.

## 📁 Folder Structure

```
content/
├── index.ts                    # Main entry point
├── styles/                     # Global styles (reusable)
│   ├── button.css             # Button styles for ALL sites
│   ├── theme.ts               # Theme variables
│   └── index.ts               # Style injection logic
├── components/                 # Reusable UI components
│   ├── Button.ts              # Global button components
│   └── StatusIndicator.ts     # Status indicator
├── sites/                      # Site-specific implementations
│   └── airbnb/
│       ├── config.ts          # Selectors & patterns
│       ├── extractors.ts      # Extract listing IDs
│       ├── injectors.ts       # Inject buttons
│       └── index.ts           # AirbnbHandler class
├── core/                       # Core functionality
│   └── observer.ts            # MutationObserver
└── utils/                      # Utility functions
    ├── dom.ts                 # DOM helpers
    └── price.ts               # Price calculations
```

## 🎯 How It Works

1. **Entry Point** (`entrypoints/content.ts`):
   - Minimal file that calls `initContentScript()`

2. **Main Initialization** (`content/index.ts`):
   - Injects global styles (CSS classes)
   - Creates Airbnb handler
   - Sets up DOM observer
   - Shows status indicator

3. **Global Styles** (`content/styles/button.css`):
   - CSS classes like `.stayfinder-listing-button`
   - Used by ALL sites (no duplication!)

4. **Reusable Components** (`content/components/Button.ts`):
   - `createListingButton()` - For listing cards
   - `createDetailButton()` - For detail pages
   - Works for ANY site

5. **Site-Specific Logic** (`content/sites/airbnb/`):
   - Only contains Airbnb-specific selectors
   - Uses global components
   - Clean separation of concerns

## 🚀 Adding a New Site (e.g., VRBO)

### Step 1: Create Site Folder
```
content/sites/vrbo/
├── config.ts
├── extractors.ts
├── injectors.ts
└── index.ts
```

### Step 2: Create Config (`vrbo/config.ts`)
```typescript
export const VRBO_CONFIG = {
  name: 'VRBO',
  
  selectors: {
    listingLinks: 'a[href*="/vacation-rentals/"]',
    detailPageElement: '.your-vrbo-selector',
  },
  
  patterns: {
    listingIdFromUrl: /\/vacation-rentals\/(\d+)/,
  },
  
  delays: {
    initialLoad: 2000,
  },
};
```

### Step 3: Create Extractors (`vrbo/extractors.ts`)
```typescript
import { VRBO_CONFIG } from './config';

export function extractListingIds(): string[] {
  const ids: string[] = [];
  
  const urlMatch = window.location.href.match(VRBO_CONFIG.patterns.listingIdFromUrl);
  if (urlMatch) ids.push(urlMatch[1]);
  
  const links = document.querySelectorAll(VRBO_CONFIG.selectors.listingLinks);
  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    const match = href.match(VRBO_CONFIG.patterns.listingIdFromUrl);
    if (match && !ids.includes(match[1])) {
      ids.push(match[1]);
    }
  });
  
  return ids;
}

export function isDetailPage(): boolean {
  return !!window.location.href.match(VRBO_CONFIG.patterns.listingIdFromUrl);
}
```

### Step 4: Create Injectors (`vrbo/injectors.ts`)
```typescript
import { VRBO_CONFIG } from './config';
import { createListingButton, createDetailButton } from '../../components/Button';
import { findCardContainer, findImageWrapper } from '../../utils/dom';

export function injectListingButtons(processedIds: Set<string>) {
  const links = document.querySelectorAll(VRBO_CONFIG.selectors.listingLinks);
  
  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    const match = href.match(VRBO_CONFIG.patterns.listingIdFromUrl);
    if (!match || processedIds.has(match[1])) return;
    
    const listingId = match[1];
    processedIds.add(listingId);
    
    // Find VRBO-specific container (adjust as needed)
    const cardContainer = findCardContainer(link as HTMLElement);
    if (!cardContainer) return;
    
    const imageWrapper = findImageWrapper(cardContainer);
    if (!imageWrapper) return;
    
    // ⭐ Use GLOBAL button component
    const button = createListingButton({ listingId });
    imageWrapper.appendChild(button);
  });
}

export function injectDetailButton() {
  if (document.querySelector('.stayfinder-detail-button')) return;
  
  const detailElement = document.querySelector(VRBO_CONFIG.selectors.detailPageElement);
  if (!detailElement) return;
  
  // ⭐ Use GLOBAL button component
  const button = createDetailButton({});
  (detailElement as HTMLElement).appendChild(button);
}
```

### Step 5: Create Handler (`vrbo/index.ts`)
```typescript
import { VRBO_CONFIG } from './config';
import { extractListingIds } from './extractors';
import { injectListingButtons, injectDetailButton } from './injectors';

export class VrboHandler {
  private processedIds = new Set<string>();
  
  init() {
    console.log(`Initializing ${VRBO_CONFIG.name} handler`);
    
    setTimeout(() => {
      this.run();
    }, VRBO_CONFIG.delays.initialLoad);
  }
  
  run() {
    console.log('Running VRBO handler...');
    
    const ids = extractListingIds();
    if (ids.length > 0) {
      console.log(`📤 Found ${ids.length} VRBO listing IDs`);
      this.sendListingIds(ids);
    }
    
    injectListingButtons(this.processedIds);
    injectDetailButton();
  }
  
  private sendListingIds(ids: string[]) {
    const listingData = ids.map(id => ({ vrbo_id: id }));
    browser.runtime.sendMessage(listingData)
      .then(() => console.log('✅ VRBO IDs sent'))
      .catch((err) => console.error('❌ Error:', err));
  }
}
```

### Step 6: Update Main Entry (`content/index.ts`)
```typescript
import { VrboHandler } from './sites/vrbo';

export function initContentScript() {
  console.log('🚀 StayFinder Extension Started!');
  
  injectGlobalStyles();
  
  // Detect which site we're on
  const hostname = window.location.hostname;
  let handler;
  
  if (hostname.includes('airbnb')) {
    handler = new AirbnbHandler();
  } else if (hostname.includes('vrbo')) {
    handler = new VrboHandler();
  }
  
  if (handler) {
    handler.init();
    setupObserver(handler);
  }
  
  showStatusIndicator();
}
```

### Step 7: Update Matches (`entrypoints/content.ts`)
```typescript
export default defineContentScript({
  matches: [
    '*://*.airbnb.com/*', 
    '*://*.airbnb.ca/*', 
    '*://*.airbnb.co.uk/*',
    '*://*.vrbo.com/*',        // ⭐ Add VRBO
  ],
  
  main() {
    initContentScript();
  }
});
```

## ✅ Benefits

1. **No Code Duplication**: All sites use the same button components and styles
2. **Easy to Extend**: Add new sites by copying the pattern
3. **Maintainable**: Each module has a single responsibility
4. **Global Styles**: Update button appearance once, applies everywhere
5. **Type Safe**: TypeScript ensures correctness

## 🎨 Customizing Styles

### Global Changes (All Sites)
Edit `content/styles/button.css`:
```css
.stayfinder-listing-button {
  background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%) !important;
  /* Changes apply to Airbnb, VRBO, Booking.com, etc. */
}
```

### Site-Specific Overrides
Create `content/sites/airbnb/overrides.css`:
```css
/* Only for Airbnb */
.stayfinder-listing-button {
  padding: 12px 20px !important;
}
```

Then inject in `airbnb/index.ts`:
```typescript
import overrideCSS from './overrides.css?raw';
injectSiteStyles('airbnb', overrideCSS);
```

## 📝 Notes

- All button styles are in `content/styles/button.css`
- All button logic is in `content/components/Button.ts`
- Site-specific code only handles DOM selection and extraction
- Observer automatically detects new listings on any site
- Same user experience across all sites

