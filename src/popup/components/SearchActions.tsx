// src/popup/components/SearchActions.tsx

interface Props {
  onSearchFree: () => void;
  onSearchCredits: () => void;
}

export default function SearchActions({ onSearchFree, onSearchCredits }: Props) {
  return (
    <div className="px-3 py-3" style={{ borderTop: "1px solid var(--border-dim)" }}>
      <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
        not happy? Search instead
      </p>
      <div className="flex gap-2">
        <button
          onClick={onSearchFree}
          className="flex-1 text-xs font-medium py-2 rounded transition-all duration-150"
          style={{
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-bright)",
            color: "var(--text-primary)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-bright)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
          }}
        >
          FREE
        </button>
        <button
          onClick={onSearchCredits}
          className="flex-1 text-xs font-medium py-2 rounded transition-all duration-150"
          style={{
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-bright)",
            color: "var(--text-primary)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-bright)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
          }}
        >
          CREDITS
        </button>
      </div>
    </div>
  );
}