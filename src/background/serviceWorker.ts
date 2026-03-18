import { getSettings } from "../utils/storage";
import { incrementQuota, getRemainingQuota } from "../utils/quota";
import type { SearchResult, MessageType } from "../types";

const searchGoogle = async (
  query: string,
  apiKey: string,
): Promise<SearchResult[]> => {
  const response = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: {
      "X-API-KEY": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ q: query, num: 5 }),
  });

  if (response.status === 401) throw new Error("INVALID_KEY");
  if (response.status === 429) throw new Error("QUOTA_EXCEEDED");
  if (!response.ok) {
    const text = await response.text();
    console.log("Serper error status:", response.status, "body:", text);
    throw new Error("SEARCH_FAILED");
  }

  const data = await response.json();

  if (!data.organic || data.organic.length === 0) return [];

  return data.organic
    .slice(0, 5)
    .map((item: { title: string; displayLink: string; link: string }) => ({
      title: item.title,
      domain: item.displayLink,
      url: item.link,
    }));
};

const extractFromPage = async () => {
  const SUPPORTED = [
    "news.yahoo.com",
    "www.yahoo.com",
    "yahoo.com",
    "health.yahoo.com",
    "finance.yahoo.com",
    "sports.yahoo.com",
    "entertainment.yahoo.com",
    "www.msn.com",
    "msn.com",
    "news.google.com",
    "www.bing.com",
    "bing.com",
    "www.aol.com",
    "aol.com",
    "www.newsbreak.com",
    "newsbreak.com",
    "ground.news",
    "www.ground.news",
    "www.newsnow.co.uk",
    "newsnow.co.uk",
  ];

  const hostname = window.location.hostname;
  if (!SUPPORTED.includes(hostname)) return null;

  const isMsn = hostname.includes("msn.com");

  if (isMsn) {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const providerEl = document.querySelector('[data-t*="c.hl"]');
    if (providerEl) {
      try {
        const dataT = JSON.parse(providerEl.getAttribute("data-t") ?? "{}");
        const headline = (dataT["c.hl"] as string | undefined)?.trim() ?? "";
        const publisher = (dataT["c.b"] as string | undefined)?.trim() ?? "";

        return { headline, publisher };
      } catch {
        // fall through to generic extraction
      }
    }
  }

  const h1Elements = document.querySelectorAll("h1");
  let headline = "";
  h1Elements.forEach((el) => {
    const text = el.textContent?.trim() ?? "";
    if (text.length > headline.length) headline = text;
  });

  if (!headline || headline.length < 10) {
    headline = document.querySelector("h2")?.textContent?.trim() ?? "";
  }
  if (!headline || headline.length < 10) {
    headline = document.title?.trim() ?? "";
  }

  let publisher = "";

  const meta = document.querySelector('meta[property="og:site_name"]');
  const metaContent = meta?.getAttribute("content") ?? "";
  const metaLower = metaContent.toLowerCase();
  const aggregatorNames = [
    "yahoo",
    "msn",
    "google news",
    "bing",
    "aol",
    "newsbreak",
    "ground news",
    "newsnow",
    "microsoft",
  ];
  if (metaContent && !aggregatorNames.some((n) => metaLower.includes(n))) {
    publisher = metaContent;
  }

  if (!publisher) {
    const byline = document.querySelector(
      ".caas-author-link, .provider-name, .source-name, .publisher-name, .authortext, .source, .SourceLink, .displayProvider, .source-title, .publication-name, .story-source, .nn-source, .feed-item-source",
    );
    if (byline?.textContent) publisher = byline.textContent.trim();
  }

  if (!publisher) {
    const canonical = document.querySelector('link[rel="canonical"]');
    const href = canonical?.getAttribute("href") ?? "";
    if (href) {
      try {
        const u = new URL(href);
        const hostBase = hostname.replace("www.", "").split(".")[0];
        if (!u.hostname.includes(hostBase)) {
          publisher = u.hostname.replace("www.", "");
        }
      } catch {
        /* ignore */
      }
    }
  }

  return { headline, publisher };
};

chrome.runtime.onMessage.addListener(
  (message: MessageType, _sender, sendResponse) => {
    console.log("Service worker received message:", message);
    if (message.type !== "SEARCH") return;

    const tabId = message.tabId;

    (async () => {
      try {
        const settings = await getSettings();
        if (!settings) {
          sendResponse({ type: "SEARCH_ERROR", error: "NO_SETTINGS" });
          return;
        }

        const results = await chrome.scripting.executeScript({
          target: { tabId },
          func: extractFromPage,
          world: "MAIN",
        });

        console.log("Script execution results:", JSON.stringify(results));

        const extracted = results?.[0]?.result as {
          headline: string;
          publisher: string;
        } | null;
        console.log("Extracted data:", JSON.stringify(extracted));

        if (!extracted) {
          console.log("No extracted data, sending NOT_SUPPORTED");
          sendResponse({ type: "NOT_SUPPORTED" });
          return;
        }

        const normalisedPublisher = extracted.publisher
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");

        const quotedQuery = normalisedPublisher
          ? `"${extracted.headline}" "${normalisedPublisher}"`
          : `"${extracted.headline}"`;

        let searchResults = await searchGoogle(quotedQuery, settings.apiKey);

        if (searchResults.length === 0) {
          const fallbackQuery = normalisedPublisher
            ? `${extracted.headline} ${normalisedPublisher}`
            : extracted.headline;
          searchResults = await searchGoogle(fallbackQuery, settings.apiKey);
        }

        await incrementQuota();
        const remaining = await getRemainingQuota();

        sendResponse({
          type: "SEARCH_RESULTS",
          results: searchResults,
          quotaUsed: 100 - remaining,
        });
      } catch (error) {
        console.log("Service worker error:", error);
        const errMessage =
          error instanceof Error ? error.message : "UNKNOWN_ERROR";
        sendResponse({ type: "SEARCH_ERROR", error: errMessage });
      }
    })();

    return true;
  },
);
