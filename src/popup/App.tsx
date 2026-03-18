import { useEffect, useState } from "react";
import { getSettings, getQuota } from "../utils/storage";
import type { SearchResult, QuotaData } from "../types";
import SettingsForm from "./components/SettingsForm";
import ResultsList from "./components/ResultsList";
import ErrorMessage from "./components/ErrorMessage";
import UsageCounter from "./components/UsageCounter";

type AppState = "loading" | "settings" | "searching" | "results" | "error";

declare global {
  interface Window {
    __searchInitiated?: boolean
  }
}

export default function App() {
  const [appState, setAppState] = useState<AppState>("loading");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState("");
  const [quota, setQuota] = useState<QuotaData>({ count: 0, date: "" });

  const loadQuota = async () => {
    const q = await getQuota();
    setQuota(q);
  };

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
      (response) => {
        if (!response) {
          setError("UNKNOWN_ERROR");
          setAppState("error");
          return;
        }

        if (response.type === "SEARCH_RESULTS") {
          setResults(response.results);
          loadQuota();
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
      await loadQuota();
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
      <div className="w-80 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-500">
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

  if (appState === "error") {
    return (
      <ErrorMessage
        error={error}
        onRetry={handleRetry}
        onOpenSettings={handleSettingsSaved}
      />
    );
  }

  return (
    <div className="w-80">
      <div className="px-3 py-2 border-b border-gray-100">
        <h1 className="text-xs font-semibold text-gray-800">De-aggregator</h1>
        <p className="text-xs text-gray-400">
          Select the original article to open
        </p>
      </div>
      <ResultsList results={results} onOpen={handleOpenUrl} />
      <UsageCounter quota={quota} />
    </div>
  );
}
