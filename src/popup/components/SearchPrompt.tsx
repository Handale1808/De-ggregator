interface Props {
  onSearch: () => void;
}

export default function SearchPrompt({ onSearch }: Props) {
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
      <button
        onClick={onSearch}
        className="w-full text-xs font-medium py-2 rounded transition-all duration-150"
        style={{
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-bright)",
          color: "var(--text-primary)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor =
            "var(--accent)";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor =
            "var(--border-bright)";
          (e.currentTarget as HTMLButtonElement).style.color =
            "var(--text-primary)";
        }}
      >
        Search
      </button>
    </div>
  );
}