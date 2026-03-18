// src/popup/components/SearchPrompt.tsx

import SearchActions from "./SearchActions";

interface Props {
  onSearchCredits: () => void;
  onSearchFree: () => void;
}

export default function SearchPrompt({ onSearchCredits, onSearchFree }: Props) {
  return (
    <div className="p-4" style={{ backgroundColor: "var(--bg-base)" }}>
      <p
        className="text-xs mb-1"
        style={{ color: "var(--text-primary)" }}
      >
        No source link found on this page.
      </p>
      <p
        className="text-xs mb-3"
        style={{ color: "var(--text-secondary)" }}
      >
        Search the web to find the original article.
      </p>
      <SearchActions
        onSearchFree={onSearchFree}
        onSearchCredits={onSearchCredits}
      />
    </div>
  );
}