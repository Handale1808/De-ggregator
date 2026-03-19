# De-ggregator

A Chrome extension that finds the original source article when you're reading news on an aggregator site. Instead of staying trapped on Yahoo News, MSN, AOL, or NewsBreak, De-ggregator surfaces the original publisher's page in one click.

---

## Supported sites

- Yahoo News (`news.yahoo.com`, `www.yahoo.com`, `health.yahoo.com`)
- MSN (`www.msn.com`)
- AOL (`www.aol.com`)
- NewsBreak (`www.newsbreak.com`)

---

## Installation

### From source

1. Clone this repository
2. Run `npm install`
3. Run `npm run build` — this outputs to the `dist/` folder
4. Open Chrome and go to `chrome://extensions`
5. Enable **Developer mode** (top right)
6. Click **Load unpacked** and select the `dist/` folder

### API key setup

De-ggregator uses the [Serper](https://serper.dev) API for web searches. You get 2,500 free credits on signup.

1. Sign up at [serper.dev](https://serper.dev) and copy your API key
2. Open the extension — it will prompt you for the key on first use
3. Paste it in and click **Save and continue**

Your key is stored locally in `chrome.storage.local` and never sent anywhere except directly to Serper's API.

---

## Usage

1. Navigate to a news article on any supported aggregator
2. Click the De-ggregator icon in your toolbar
3. The extension will attempt to find the original article automatically

**If a direct source link is found** — it appears immediately. Click to open it.

**If no direct link is found** — you'll be offered two search options:

| Option | What it does |
|---|---|
| FREE | Opens a Google News search in a new tab (no credits used) |
| CREDITS | Uses your Serper API key to run a targeted search and shows ranked results |

### Usage limits

Serper searches are counted against a daily limit of 100. The counter resets at midnight. When you hit the limit the extension will let you know and you can still use the free Google search option.

---

## How it works

### Architecture

The extension has three main parts:

- **Service worker** (`src/background/serviceWorker.ts`) — handles all messaging, script injection, API calls, and caching
- **Content script** (`src/content/extractor.ts`) — injected into the active tab to extract the headline, publisher, and any direct source URL from the page
- **Popup** (`src/popup/`) — React UI that manages app state and renders results

### Extraction flow

When the popup opens, it sends a `SEARCH` message to the service worker with the current tab ID. The service worker then:

1. Injects the content script into the active tab
2. Reads back the extracted result from `window.__deaggResult`
3. Returns one of three responses to the popup:
   - `DIRECT_RESULT` — a source URL was found on the page
   - `NO_DIRECT_RESULT` — headline and publisher were extracted but no source URL
   - `NOT_SUPPORTED` — the current site is not a recognised aggregator

### Finding the source URL

The content script tries two strategies in order:

1. **Canonical tag** — checks `<link rel="canonical">` for a URL pointing to a different domain
2. **Article link heuristic** — scans all `<a>` tags for external links whose path is longer than 30 characters and contains a known article pattern (`/news/`, `/article/`, `/story/`, `/post/`)

### Publisher extraction

Each supported site has its own extractor that tries multiple DOM strategies in order of reliability:

| Site | Strategies |
|---|---|
| Yahoo | `og:site_name` meta tag, byline/provider CSS selectors, canonical URL hostname |
| MSN | `data-t` JSON attribute, CSS class selectors, `og:site_name`, URL path parsing (`/source/`) |
| AOL | `og:site_name` meta tag, CSS class selectors, canonical URL hostname |
| NewsBreak | CSS class selectors, `og:site_name`, author byline, URL path first segment |

### Serper search

When a credit search is triggered, the service worker:

1. Normalises the publisher name (strips accented characters via NFD)
2. Runs a quoted query: `"headline" "publisher"`
3. Falls back to an unquoted query if no results come back
4. Caches results in `chrome.storage.local` keyed by the first 100 characters of the headline
5. Increments the daily usage counter

---

## Project structure

```
src/
  background/
    serviceWorker.ts       # Message handling, Serper API calls, caching
  content/
    extractor.ts           # Injected into the page to extract article data
  extractors/
    index.ts               # Registry of supported sites and extractor lookup
    yahoo.ts
    msn.ts
    aol.ts
    newsbreak.ts
  popup/
    App.tsx                # Root component, app state machine
    main.tsx               # React entry point
    index.html
    index.css              # CSS variables and global styles
    components/
      DirectResult.tsx     # Shows a confirmed direct source link
      SearchPrompt.tsx     # Shown when no direct link was found
      ResultsList.tsx      # Renders Serper search results
      ResultItem.tsx       # Individual result row
      SearchActions.tsx    # FREE / CREDITS search buttons
      SettingsForm.tsx     # API key entry
      ErrorMessage.tsx     # Error states with contextual messaging
      UsageCounter.tsx     # Daily usage display
  types/
    index.ts               # Shared types across the extension
  utils/
    storage.ts             # chrome.storage.local helpers for settings
    quota.ts               # Daily usage tracking
```

---

## Development

### Prerequisites

- Node.js 18+
- A Serper API key for testing search functionality

### Setup

```bash
npm install
npm run dev     # watch mode
npm run build   # production build
```

### Adding a new site

1. Create a new extractor file in `src/extractors/` — export a single function that returns the publisher name as a string
2. Register the hostname(s) in `src/extractors/index.ts` under `EXTRACTOR_MAP`
3. The content script will pick it up automatically via `isSupportedSite` and `extractPublisher`

The extractor function runs inside the page context, so it has full access to the DOM. Return an empty string if extraction fails — the search will still work without a publisher name, just with less precise results.

---

## Privacy

- Your API key is stored in `chrome.storage.local` — it stays on your device
- The extension only reads page content on supported aggregator sites
- Serper searches include the article headline and publisher name — no personally identifiable information