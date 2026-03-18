import { useState } from 'react'
import { saveSettings } from '../../utils/storage'
import type { ExtensionSettings } from '../../types'

interface Props {
  onSaved: () => void
}

export default function SettingsForm({ onSaved }: Props) {
  const [apiKey, setApiKey] = useState('')
  const [searchEngineId, setSearchEngineId] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    if (!apiKey.trim() || !searchEngineId.trim()) {
      setError('Both fields are required')
      return
    }

    setSaving(true)
    setError('')

    const settings: ExtensionSettings = {
      apiKey: apiKey.trim(),
      searchEngineId: searchEngineId.trim(),
    }

    await saveSettings(settings)
    setSaving(false)
    onSaved()
  }

  return (
    <div className="p-4 w-80">
      <h1 className="text-base font-semibold text-gray-800 mb-1">
        De-aggregator
      </h1>
      <p className="text-xs text-gray-500 mb-4">
        Enter your Google API credentials to get started.
      </p>

      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          API Key
        </label>
        <input
          type="password"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          placeholder="Paste your Google API key"
          className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Search Engine ID
        </label>
        <input
          type="password"
          value={searchEngineId}
          onChange={e => setSearchEngineId(e.target.value)}
          placeholder="Paste your Search Engine ID"
          className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-blue-500"
        />
      </div>

      {error && (
        <p className="text-xs text-red-500 mb-3">{error}</p>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-blue-600 text-white text-xs font-medium py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save and continue'}
      </button>

      <p className="text-xs text-gray-400 mt-3">
        Your credentials are stored locally and never shared.
      </p>
    </div>
  )
}