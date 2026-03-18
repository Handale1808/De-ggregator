// src/popup/components/ErrorMessage.tsx

interface Props {
  error: string;
  onRetry?: () => void;
  onOpenSettings?: () => void;
}

export default function ErrorMessage({
  error,
  onRetry,
  onOpenSettings,
}: Props) {
  const getMessage = () => {
    switch (error) {
      case "QUOTA_EXCEEDED":
        return {
          title: "Daily limit reached",
          body: "You have used all 100 free searches for today. The limit resets at midnight.",
          primaryAction: null,
          showSettingsLink: true,
        };
      case "INVALID_KEY":
        return {
          title: "Invalid API credentials",
          body: "Your API key appears to be incorrect.",
          primaryAction: "Update API key",
          showSettingsLink: false,
        };
      case "NO_SETTINGS":
        return {
          title: "No credentials saved",
          body: "Enter your Serper API token to get started.",
          primaryAction: "Enter API key",
          showSettingsLink: false,
        };
      case "NOT_SUPPORTED":
        return {
          title: "Site not supported",
          body: "This page is not a recognised news aggregator. Open an article on Yahoo News, MSN, Google News, AOL, NewsBreak, or NewsNow.",
          primaryAction: null,
          showSettingsLink: true,
        };
      default:
        return {
          title: "Something went wrong",
          body: "An unexpected error occurred. Please try again.",
          primaryAction: null,
          showSettingsLink: true,
        };
    }
  };

  const { title, body, primaryAction, showSettingsLink } = getMessage();

  return (
    <div className="p-4 w-80" style={{ backgroundColor: "var(--bg-base)" }}>
      <p
        className="text-xs font-semibold mb-1 tracking-wide"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </p>
      <p className="text-xs mb-3" style={{ color: "var(--text-secondary)" }}>
        {body}
      </p>

      {primaryAction && onOpenSettings && (
        <button
          onClick={onOpenSettings}
          className="w-full text-xs font-medium py-2 rounded transition-all duration-150 mb-2"
          style={{
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--accent)",
            color: "var(--accent)",
            boxShadow: "var(--accent-glow)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "var(--accent)";
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--bg-base)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "var(--accent-glow-strong)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "var(--bg-surface)";
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--accent)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "var(--accent-glow)";
          }}
        >
          {primaryAction}
        </button>
      )}

      {!primaryAction && onRetry && (
        <button
          onClick={onRetry}
          className="w-full text-xs font-medium py-2 rounded transition-all duration-150 mb-2"
          style={{
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-bright)",
            color: "var(--text-primary)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "var(--accent)";
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--accent)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "var(--border-bright)";
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--text-primary)";
          }}
        >
          Try again
        </button>
      )}

      {showSettingsLink && onOpenSettings && (
        <button
          onClick={onOpenSettings}
          className="w-full text-xs py-1 transition-colors duration-150"
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
          Update API key
        </button>
      )}
    </div>
  );
}
