import type { SearchResult } from "../../types";
import ResultItem from "./ResultItem";

interface Props {
  url: string;
  onSearch: () => void;
}

export default function DirectResult({ url, onSearch }: Props) {
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
      <ResultItem result={result} onOpen={(u) => chrome.tabs.create({ url: u })} />
      <div className="px-3 py-2 text-center">
        <button
          onClick={onSearch}
          className="text-xs transition-colors duration-150"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--text-secondary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--text-muted)";
          }}
        >
          Not the right link? Search instead
        </button>
      </div>
    </div>
  );
}