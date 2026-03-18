// src/popup/components/SettingsForm.tsx

import { useState } from "react";
import { saveSettings } from "../../utils/storage";
import type { ExtensionSettings } from "../../types";

interface Props {
  onSaved: () => void;
}

export default function SettingsForm({ onSaved }: Props) {
  const [apiKey, setApiKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setError("API key is required");
      return;
    }

    setSaving(true);
    setError("");

    const settings: ExtensionSettings = {
      apiKey: apiKey.trim(),
    };

    await saveSettings(settings);
    setSaving(false);
    onSaved();
  };

  return (
    <div className="p-4 w-80" style={{ backgroundColor: "var(--bg-base)" }}>
      <h1
        className="text-sm font-semibold tracking-widest uppercase mb-1"
        style={{ color: "var(--accent)", textShadow: "var(--accent-glow)" }}
      >
        De-aggregator
      </h1>
      <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
        Enter your Serper API token to get started
      </p>

      <div className="mb-3">
        <label
          className="block text-xs font-medium mb-1"
          style={{ color: "var(--text-secondary)" }}
        >
          Serper API Token
        </label>
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Paste your Serper API Token"
          className="w-full text-xs rounded px-2 py-1.5 focus:outline-none"
          style={{
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-dim)",
            color: "var(--text-primary)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.boxShadow = "var(--accent-glow)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--border-dim)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      </div>

      {error && (
        <p
          className="text-xs mb-3"
          style={{ color: "var(--danger)", textShadow: "var(--danger-glow)" }}
        >
          {error}
        </p>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full text-xs font-medium py-2 rounded disabled:opacity-40 transition-all duration-150"
        style={{
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--accent)",
          color: "var(--accent)",
          boxShadow: "var(--accent-glow)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "var(--accent)";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--bg-base)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "var(--accent-glow-strong)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "var(--bg-surface)";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "var(--accent-glow)";
        }}
      >
        {saving ? "Saving..." : "Save and continue"}
      </button>

      <p className="text-xs mt-3" style={{ color: "var(--text-muted)" }}>
        Your API key is stored locally and never shared.
      </p>
    </div>
  );
}
