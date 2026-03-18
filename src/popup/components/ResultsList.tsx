import type { SearchResult } from "../../types";
import ResultItem from "./ResultItem";

interface Props {
  results: SearchResult[];
  onOpen: (url: string) => void;
}

export default function ResultsList({ results, onOpen }: Props) {
  if (results.length === 0) {
    return (
      <div
        className="px-3 py-6 text-center"
        style={{ backgroundColor: "var(--bg-surface)" }}
      >
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          No results found for this article.
        </p>
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          Try opening the article in its own tab and searching again.
        </p>
      </div>
    );
  }

  return (
    <div>
      {results.map((result, index) => (
        <ResultItem key={index} result={result} onOpen={onOpen} index={index} />
      ))}
    </div>
  );
}
