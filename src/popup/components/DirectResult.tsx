// src/popup/components/DirectResult.tsx

import type { SearchResult } from "../../types";
import ResultItem from "./ResultItem";
import SearchActions from "./SearchActions";

interface Props {
  url: string;
  onSearchCredits: () => void;
  onSearchFree: () => void;
}

export default function DirectResult({
  url,
  onSearchCredits,
  onSearchFree,
}: Props) {
  const domain = (() => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return url;
    }
  })();

  const result: SearchResult = {
    title: domain,
    domain,
    url,
  };

  return (
    <div>
      <ResultItem
        result={result}
        onOpen={(u) => chrome.tabs.create({ url: u })}
        alwaysShowUrl
      />
      <SearchActions
        onSearchFree={onSearchFree}
        onSearchCredits={onSearchCredits}
      />
    </div>
  );
}
