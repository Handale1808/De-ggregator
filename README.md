# De-aggregator

A powerful Chrome extension that automatically finds the original source of aggregated news articles, saving you time and frustration when navigating news aggregator sites.

## 🎯 Problem Solved

When reading news on aggregator sites like Yahoo News, MSN, Google News, AOL, or NewsBreak, finding the original article source often requires manual searching and multiple clicks. De-aggregator automates this process by:

- **Direct Detection**: Automatically identifies when an article links directly to the original source
- **Smart Search**: Uses advanced search techniques to find the original article when direct links aren't available
- **Fallback Options**: Provides both API-powered and free Google News search options
- **Usage Tracking**: Monitors your daily API quota to optimize costs

## ✨ Key Features

### 🚀 One-Click Operation
- Click the toolbar icon on any supported aggregator site
- Automatically extracts article headline and publisher information
- Opens original source articles in new tabs

### 🎯 Smart Detection
- **Direct URL extraction** when available
- **Publisher name extraction** from multiple page elements
- **Fallback search strategies** for hard-to-find articles

### 📊 Usage Management
- **API quota tracking** (2,500 free searches monthly via Serper API)
- **Visual usage counter** showing remaining searches
- **Free Google News search** option when quota is exhausted

### 🔧 Developer-Friendly
- **Modular extractor system** for easy site support additions
- **TypeScript** throughout for type safety
- **React + Tailwind CSS** for modern UI
- **Comprehensive error handling** with user-friendly messages

## 🏗️ Architecture

### Core Components

```
src/
├── background/          # Service worker for API calls and message handling
├── content/            # Content script for page data extraction
├── popup/              # React-based popup interface
├── extractors/         # Site-specific data extraction logic
├── types/              # TypeScript type definitions
└── utils/              # Shared utilities (storage, quota management)
```

### Data Flow
1. **User clicks extension icon** → Popup opens
2. **Content script extracts** headline and publisher from current page
3. **Service worker processes** data and searches for original source
4. **Results displayed** in popup with direct links to original articles

### Search Strategy
- **Primary**: Extract direct URL from page metadata
- **Secondary**: Search with quoted headline and publisher
- **Fallback**: Search with headline and publisher (unquoted)
- **Free Option**: Google News search with article context

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- Serper API account (for Google Search API access)

### 1. Get Serper API Key

1. Visit [serper.dev](https://serper.dev)
2. Sign up for a free account
3. Get your API key from the dashboard
4. The free tier provides 2,500 searches per month

### 2. No Search Engine ID Needed

Serper handles the search engine configuration automatically - no separate Search Engine ID required!

### 3. Extension Installation

```bash
# Clone the repository
git clone <repository-url>
cd De-ggregator/De-ggregator

# Install dependencies
npm install

# Build the extension
npm run build

# Load in Chrome
# 1. Open chrome://extensions
# 2. Enable Developer mode
# 3. Click "Load unpacked"
# 4. Select the 'dist' folder
```

### 4. Configuration

1. Click the De-aggregator icon in your toolbar
2. Enter your **Serper API Key**
3. Save and start using!

## 📖 Usage Guide

### Basic Usage
1. Navigate to any article on a supported site
2. Click the De-aggregator toolbar icon
3. **If direct URL found**: Click "Open Original Article"
4. **If no direct URL**: Choose search method:
   - **Search with Credits**: Uses API quota (recommended)
   - **Search Free**: Opens Google News in new tab

### Supported Sites
- **Yahoo News** (news.yahoo.com, www.yahoo.com, health.yahoo.com)
- **MSN** (www.msn.com, msn.com)
- **Google News** (news.google.com)
- **AOL** (www.aol.com, aol.com)
- **NewsBreak** (www.newsbreak.com, newsbreak.com)

### Understanding Results
- **Direct Result**: Original article URL found on page
- **Search Results**: Multiple potential sources ranked by relevance
- **Usage Counter**: Shows remaining API searches for the day

## 🛠️ Development

### Adding Support for New Sites

1. **Create Extractor**: Add new file in `src/extractors/[sitename].ts`

```typescript
export const extract[SiteName] = (): string => {
  // Extract publisher name from page
  // Return publisher name or empty string
  const publisher = document.querySelector('[data-publisher]');
  return publisher?.textContent?.trim() ?? '';
};
```

2. **Register Extractor**: Update `src/extractors/index.ts`

```typescript
import { extract[SiteName] } from './[sitename]'

const EXTRACTOR_MAP: Record<string, () => string> = {
  // ... existing mappings
  '[domain]': extract[SiteName],
}
```

3. **Test**: Build and test on the target site

### Project Structure

```typescript
// Core types
interface SearchResult {
  title: string;
  domain: string;
  url: string;
}

interface ExtractedData {
  headline: string;
  publisher: string;
  directUrl: string | null;
}

// Message types for communication
type MessageType = 
  | { type: "SEARCH"; tabId: number }
  | { type: "SEARCH_RESULTS"; results: SearchResult[] }
  | { type: "DIRECT_RESULT"; url: string }
  // ... more types
```

### Available Scripts

```bash
npm run dev      # Development mode with hot reload
npm run build    # Production build
npm run lint     # ESLint checking
npm run preview  # Preview built extension
```

## 🔧 Configuration Options

### Environment Variables
Create `.env` file in root directory:

```env
VITE_API_KEY=your_serper_api_key
```

### Extension Permissions
The extension requests:
- `storage` - Save API keys and usage data
- `activeTab` - Access current tab content
- `scripting` - Inject content scripts
- `tabs` - Open new tabs for results
- `https://google.serper.dev/*` - Search API access

## 🐛 Troubleshooting

### Common Issues

**"Not Supported" Error**
- Ensure you're on a supported aggregator site
- Check that the page fully loads before clicking the icon

**"Invalid API Key" Error**
- Verify your Serper API key is correct
- Check your Serper dashboard for key status
- Ensure the key hasn't expired or been revoked

**"Quota Exceeded" Error**
- Free tier allows 2,500 searches per month
- Use the "Search Free" option as fallback
- Quota resets monthly on your billing date

**No Results Found**
- Try the free Google News search option
- Some articles may not have original sources available
- Check if the article is from a wire service or syndicated content

### Debug Mode
Open Chrome DevTools and check:
- **Console** for extension errors
- **Network** tab for API calls
- **Extension popup** for detailed error messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-site-support`
3. Add your extractor and tests
4. Submit a pull request with:
   - Description of the site supported
   - Testing methodology
   - Any special considerations

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Related Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions)
- [Serper API](https://serper.dev) - Google Search API for developers
- [Serper API Documentation](https://serper.dev/api)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

**De-aggregator** - Because your time is better spent reading news, not searching for it.