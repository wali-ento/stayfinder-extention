# 🏠 StayFinder Chrome Extension

Save money by finding direct booking options for vacation rentals listed on Airbnb.

## 🚀 Quick Start

### Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Create distribution zip
pnpm zip
```

### Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `.output/chrome-mv3` folder

## 📋 Features

- **Search Results Badges** - Shows savings badges on Airbnb search results
- **Listing Page Widget** - Displays price comparison widget on Airbnb listing pages
- **Booking Tracking** - Tracks booking completions on property manager websites
- **User Statistics** - Shows total savings and booking stats in popup
- **Settings Page** - Configure extension features and preferences

## 🧪 Testing

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Generate coverage report
pnpm test:coverage

# Run tests with UI
pnpm test:ui
```

## 🏗️ Project Structure

```
stayfinder-extension/
├── entrypoints/
│   ├── background.ts              # Background service worker
│   ├── content/
│   │   ├── airbnb-search.tsx     # Search results page
│   │   ├── airbnb-listing.tsx    # Listing detail page
│   │   └── pm-tracker.ts         # PM website tracking
│   ├── popup/                     # Extension popup
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── index.html
│   └── options/                   # Settings page
│       ├── App.tsx
│       ├── App.css
│       └── index.html
├── components/                    # Shared React components
│   ├── SavingsBadge.tsx
│   ├── CompareWidget.tsx
│   └── StatsDashboard.tsx
├── utils/                        # Utility functions
│   ├── api-client.ts            # API wrapper (with mocks)
│   ├── storage.ts               # Chrome storage wrapper
│   ├── tracking.ts              # Event tracking
│   └── parser.ts                # DOM parsing utilities
└── tests/                        # Test files
    ├── setup.ts
    ├── utils/
    └── components/
```

## 🔧 Tech Stack

- **Framework:** WXT (Vite-powered Chrome Extension framework)
- **Language:** TypeScript
- **UI Library:** React 19
- **Testing:** Vitest + Testing Library
- **Build Tool:** Vite

## 📡 API Integration

The extension uses mock data by default for development. To connect to a real backend:

1. Update `MOCK_MODE` in `utils/api-client.ts` to `false`
2. Configure the API base URL in the same file
3. Implement the required backend endpoints (see `CHROME_EXTENSION_GUIDE.md`)

### Required Endpoints

- `POST /api/v1/extension/match-property` - Match single property
- `POST /api/v1/extension/batch-match` - Match multiple properties
- `POST /api/v1/conversions/track-event` - Track user interactions
- `POST /api/v1/conversions/booking-completed` - Record booking conversions
- `GET /api/v1/extension/stats` - Get user statistics

## 🎯 Development Notes

### Mock Data

The extension uses mock APIs in development mode. To test different scenarios:

- Mock match rate is set to ~70% (configurable in `api-client.ts`)
- Mock savings range from $50-$350
- Mock API delay is 300ms

### Content Script Testing

To test content scripts locally:

1. Navigate to Airbnb search or listing page
2. Open browser DevTools Console
3. Look for StayFinder log messages
4. Badges/widgets should appear automatically

### Storage Structure

Chrome Storage is used for:

- User statistics (total savings, comparisons, bookings)
- Extension settings (feature toggles)
- API response cache (1 hour TTL)
- Retry queue for failed events
- Processed items tracking

## 🐛 Debugging

Enable verbose logging:

1. Open background service worker console
2. Check for error messages
3. Inspect storage: `chrome.storage.local.get(null, console.log)`

Common issues:

- **Badges not showing:** Check if extension is enabled in popup
- **API errors:** Verify mock mode is enabled
- **Content script not loading:** Check URL patterns in `wxt.config.ts`

## 📦 Building for Production

```bash
# Build for Chrome
pnpm build

# Build for Firefox
pnpm build:firefox

# Create distribution zips
pnpm zip
```

The production build will be in `.output/chrome-mv3` and `.output/firefox-mv2`.

## 🔒 Privacy

- Only tracks users who came from StayFinder
- No personally identifiable information (PII) collected
- All data stored locally in browser
- No third-party analytics

## 📄 License

ISC

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Ensure tests pass: `pnpm test`
5. Build successfully: `pnpm build`
6. Submit a pull request

## 📚 Documentation

See `CHROME_EXTENSION_GUIDE.md` in the parent directory for complete documentation including:

- Detailed architecture
- Implementation plan
- API specifications
- Week-by-week development guide

## 🎉 Version

1.0.0 - Initial Release

