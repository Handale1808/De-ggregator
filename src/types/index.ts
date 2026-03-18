export interface SearchResult {
  title: string
  domain: string
  url: string
}

export interface ExtractedData {
  headline: string
  publisher: string
}

export interface ExtensionSettings {
  apiKey: string
  searchEngineId: string
}

export interface QuotaData {
  count: number
  date: string
}

export type MessageType = 
  | { type: 'SEARCH'; tabId: number }
  | { type: 'SEARCH_RESULTS'; results: SearchResult[]; quotaUsed: number }
  | { type: 'SEARCH_ERROR'; error: string }
  | { type: 'NOT_SUPPORTED' }