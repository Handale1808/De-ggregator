# De-aggregator

A Chrome extension that finds the original source of aggregated news articles.

When reading an article on Yahoo News, MSN, Google News, Bing News, AOL, NewsBreak, Ground News, or NewsNow, click the toolbar icon to search for the original article and open it directly.

## Setup

### 1. Get a Google API Key

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project
3. Search for "Custom Search API" and enable it
4. Go to Credentials and create an API key
5. Restrict the key to Custom Search API only

### 2. Get a Search Engine ID

1. Go to [programmablesearchengine.google.com](https://programmablesearchengine.google.com)
2. Create a new search engine with `www.google.com` as the site
3. Copy the Search Engine ID from the control panel

### 3. Install the extension

1. Clone this repository
2. Run `npm install`
3. Run `npm run build`
4. Open Chrome and go to `chrome://extensions`
5. Turn on Developer mode
6. Click Load unpacked and select the `dist` folder
7. Click the extension icon and enter your API key and Search Engine ID

## Usage

Open any article on a supported aggregator site and click the De-aggregator icon in the toolbar. A list of results will appear — click any result to open the original article in a new tab.

The extension tracks your daily API usage and displays remaining searches. The free tier allows 100 searches per day.

## Adding support for a new site

1. Create a new file in `src/extractors/` named after the site
2. Export a single function that reads the publisher name from the page
3. Add the domain and function to the map in `src/extractors/index.ts`

## Supported sites

- Yahoo News
- MSN
- Google News
- Bing News
- AOL
- NewsBreak
- Ground News
- NewsNow