// src/types/index.ts

export interface SearchResult {
  title: string;
  domain: string;
  url: string;
}

export interface ExtractedData {
  headline: string;
  publisher: string;
  directUrl: string | null;
}

export interface ExtensionSettings {
  apiKey: string;
}

export interface QuotaData {
  count: number;
  date: string;
}

export type MessageType =
  | { type: "SEARCH"; tabId: number }
  | { type: "SEARCH_RESULTS"; results: SearchResult[]; quotaUsed: number }
  | { type: "SEARCH_ERROR"; error: string }
  | { type: "NOT_SUPPORTED" }
  | { type: "DIRECT_RESULT"; url: string; headline: string; publisher: string }
  | { type: "NO_DIRECT_RESULT"; headline: string; publisher: string }
  | {
      type: "SEARCH_WITH_CONTEXT";
      tabId: number;
      headline: string;
      publisher: string;
    };
