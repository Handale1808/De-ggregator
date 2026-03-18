// src/popup/App.tsx

import { useEffect, useState } from "react";
import { getSettings, clearSettings } from "../utils/storage";
import type { SearchResult } from "../types";
import SettingsForm from "./components/SettingsForm";
import ResultsList from "./components/ResultsList";
import ErrorMessage from "./components/ErrorMessage";
import DirectResult from "./components/DirectResult";
import SearchPrompt from "./components/SearchPrompt";

type AppState =
  | "loading"
  | "settings"
  | "searching"
  | "results"
  | "error"
  | "direct"
  | "no_direct";

declare global {
  interface Window {
    __searchInitiated?: boolean;
  }
}

export default function App() {
  const [appState, setAppState] = useState<AppState>("loading");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState("");
  const [directUrl, setDirectUrl] = useState("");
  const [searchContext, setSearchContext] = useState<{
    headline: string;
    publisher: string;
  } | null>(null);

  const runSearch = async () => {
    if (window.__searchInitiated) return;
    window.__searchInitiated = true;

    console.log("runSearch called", new Date().toISOString());
    setAppState("searching");

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab.id) {
      setError("UNKNOWN_ERROR");
      setAppState("error");
      return;
    }

    chrome.runtime.sendMessage(
      { type: "SEARCH", tabId: tab.id },

      (response: any) => {
        if (!response) {
          setError("UNKNOWN_ERROR");
          setAppState("error");
          return;
        }

        if (response.type === "DIRECT_RESULT") {
          setDirectUrl(response.url);
          setSearchContext({
            headline: response.headline,
            publisher: response.publisher,
          });
          setAppState("direct");
          return;
        }

        if (response.type === "NO_DIRECT_RESULT") {
          setSearchContext({
            headline: response.headline,
            publisher: response.publisher,
          });
          setAppState("no_direct");
          return;
        }

        if (response.type === "SEARCH_RESULTS") {
          setResults(response.results);
          setAppState("results");
          return;
        }

        if (response.type === "NOT_SUPPORTED") {
          setError("NOT_SUPPORTED");
          setAppState("error");
          return;
        }

        if (response.type === "SEARCH_ERROR") {
          setError(response.error);
          setAppState("error");
          return;
        }
      },
    );
  };

  const runSerperSearch = () => {
    if (!searchContext) return;
    setAppState("searching");

    chrome.runtime.sendMessage(
      {
        type: "SEARCH_WITH_CONTEXT",
        tabId: 0,
        headline: searchContext.headline,
        publisher: searchContext.publisher,
      },
      (response: any) => {
        if (!response) {
          setError("UNKNOWN_ERROR");
          setAppState("error");
          return;
        }

        if (response.type === "SEARCH_RESULTS") {
          setResults(response.results);
          setAppState("results");
          return;
        }

        if (response.type === "SEARCH_ERROR") {
          setError(response.error);
          setAppState("error");
          return;
        }
      },
    );
  };

  const handleFreeSearch = () => {
    if (!searchContext) return;
    const query = [searchContext.headline, searchContext.publisher]
      .filter(Boolean)
      .join(" ");
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbs=nws`;
    chrome.tabs.create({ url: searchUrl });
  };

  const handleOpenUrl = (url: string) => {
    chrome.tabs.create({ url });
  };

  const handleSettingsSaved = () => {
    window.__searchInitiated = false;
    runSearch();
  };

  const handleRetry = () => {
    window.__searchInitiated = false;
    runSearch();
  };

  useEffect(() => {
    const init = async () => {
      const settings = await getSettings();
      if (!settings) {
        setAppState("settings");
      } else {
        runSearch();
      }
    };
    init();
  }, []);

  if (appState === "loading" || appState === "searching") {
    return (
      <div
        className="w-80 p-4 flex items-center justify-center"
        style={{ backgroundColor: "var(--bg-base)" }}
      >
        <div className="text-center">
          <div
            className="w-5 h-5 rounded-full mx-auto mb-2"
            style={{
              border: "2px solid var(--border-dim)",
              borderTopColor: "var(--accent)",
              animation: "spin-glow 0.8s linear infinite",
            }}
          />
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {appState === "loading"
              ? "Starting up..."
              : "Searching for original article..."}
          </p>
        </div>
      </div>
    );
  }

  if (appState === "settings") {
    return <SettingsForm onSaved={handleSettingsSaved} />;
  }

  const handleInvalidKey = async () => {
    await clearSettings();
    window.__searchInitiated = false;
    setAppState("settings");
  };

  if (appState === "error") {
    return (
      <ErrorMessage
        error={error}
        onRetry={handleRetry}
        onOpenSettings={
          error === "INVALID_KEY" ? handleInvalidKey : handleSettingsSaved
        }
      />
    );
  }

  if (appState === "direct") {
    return (
      <div className="w-80" style={{ backgroundColor: "var(--bg-base)" }}>
        <div
          className="px-3 py-2"
          style={{ borderBottom: "1px solid var(--border-dim)" }}
        >
          <h1
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: "var(--accent)", textShadow: "var(--accent-glow)" }}
          >
            De-aggregator
          </h1>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Because fuck searching yourself
          </p>
        </div>
        <DirectResult
          url={directUrl}
          onSearchCredits={runSerperSearch}
          onSearchFree={handleFreeSearch}
        />
      </div>
    );
  }

  if (appState === "no_direct") {
    return (
      <div className="w-80" style={{ backgroundColor: "var(--bg-base)" }}>
        <div
          className="px-3 py-2"
          style={{ borderBottom: "1px solid var(--border-dim)" }}
        >
          <h1
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: "var(--accent)", textShadow: "var(--accent-glow)" }}
          >
            De-aggregator
          </h1>
        </div>
        <SearchPrompt
          onSearchCredits={runSerperSearch}
          onSearchFree={handleFreeSearch}
        />
      </div>
    );
  }

  return (
    <div className="w-80" style={{ backgroundColor: "var(--bg-base)" }}>
      <div
        className="px-3 py-2"
        style={{ borderBottom: "1px solid var(--border-dim)" }}
      >
        <h1
          className="text-xs font-semibold tracking-widest uppercase"
          style={{ color: "var(--accent)", textShadow: "var(--accent-glow)" }}
        >
          De-aggregator
        </h1>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Select the original article to open
        </p>
      </div>
      <ResultsList results={results} onOpen={handleOpenUrl} />
    </div>
  );
}
