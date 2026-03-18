import { getSettings } from "../utils/storage";
import { incrementQuota, getRemainingQuota } from "../utils/quota";
import type { MessageType, SearchResult } from "../types";

const searchSerper = async (
  query: string,
  apiKey: string,
): Promise<{ results: SearchResult[]; credits: number | null }> => {
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
  if (!response.ok) throw new Error("SEARCH_FAILED");

  const data = await response.json();
  const credits = typeof data.credits === "number" ? data.credits : null;

  if (!data.organic || data.organic.length === 0)
    return { results: [], credits };

  const results = data.organic
    .slice(0, 5)
    .map((item: { title: string; displayLink: string; link: string }) => ({
      title: item.title,
      domain: item.displayLink,
      url: item.link,
    }));

  return { results, credits };
};

const setCachedResults = async (
  headline: string,
  results: SearchResult[],
): Promise<void> => {
  const key = `cache_${headline.slice(0, 100)}`;
  await chrome.storage.local.set({
    [key]: { results, timestamp: Date.now() },
  });
};

chrome.runtime.onMessage.addListener(
  (message: MessageType, _sender, sendResponse) => {
    if (message.type !== "SEARCH") return;

    const tabId = message.tabId;

    (async () => {
      try {
        const settings = await getSettings();
        if (!settings) {
          sendResponse({ type: "SEARCH_ERROR", error: "NO_SETTINGS" });
          return;
        }

        await chrome.scripting.executeScript({
          target: { tabId },
          files: ["content.js"],
          world: "MAIN",
        });

        const readResults = await chrome.scripting.executeScript({
          target: { tabId },
          func: () =>
            (window as Window & { __deaggResult?: unknown }).__deaggResult ??
            null,
          world: "MAIN",
        });

        const extracted = readResults?.[0]?.result as {
          headline: string;
          publisher: string;
          directUrl: string | null;
        } | null;

        if (!extracted) {
          sendResponse({ type: "NOT_SUPPORTED" });
          return;
        }

        if (extracted.directUrl) {
          sendResponse({
            type: "DIRECT_RESULT",
            url: extracted.directUrl,
            headline: extracted.headline,
            publisher: extracted.publisher,
          });
          return;
        }

        sendResponse({
          type: "NO_DIRECT_RESULT",
          headline: extracted.headline,
          publisher: extracted.publisher,
        });
      } catch (error) {
        const errMessage =
          error instanceof Error ? error.message : "UNKNOWN_ERROR";
        sendResponse({ type: "SEARCH_ERROR", error: errMessage });
      }
    })();

    return true;
  },
);

chrome.runtime.onMessage.addListener(
  (message: MessageType, _sender, sendResponse) => {
    if (message.type !== "SEARCH_WITH_CONTEXT") return;

    (async () => {
      try {
        const settings = await getSettings();
        if (!settings) {
          sendResponse({ type: "SEARCH_ERROR", error: "NO_SETTINGS" });
          return;
        }

        const { headline, publisher } = message;

        const normalisedPublisher = publisher
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");

        const quotedQuery = normalisedPublisher
          ? `"${headline}" "${normalisedPublisher}"`
          : `"${headline}"`;

        let { results: searchResults, credits: serperCredits } =
          await searchSerper(quotedQuery, settings.apiKey);

        if (searchResults.length === 0) {
          const fallbackQuery = normalisedPublisher
            ? `${headline} ${normalisedPublisher}`
            : headline;
          const fallback = await searchSerper(fallbackQuery, settings.apiKey);
          searchResults = fallback.results;
          serperCredits = fallback.credits;
        }

        if (searchResults.length > 0) {
          await setCachedResults(headline, searchResults);
        }

        await incrementQuota();
        const remaining = await getRemainingQuota();

        sendResponse({
          type: "SEARCH_RESULTS",
          results: searchResults,
          serperCredits,
          quotaUsed: 100 - remaining,
        });
      } catch (error) {
        const errMessage =
          error instanceof Error ? error.message : "UNKNOWN_ERROR";
        sendResponse({ type: "SEARCH_ERROR", error: errMessage });
      }
    })();

    return true;
  },
);