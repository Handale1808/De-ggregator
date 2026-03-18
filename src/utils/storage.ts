import type { ExtensionSettings, QuotaData } from '../types'

export const getSettings = (): Promise<ExtensionSettings | null> => {
  return new Promise((resolve) => {
    chrome.storage.local.get(['apiKey', 'searchEngineId'], (result) => {
      if (result.apiKey && result.searchEngineId) {
        resolve({
          apiKey: result.apiKey as string,
          searchEngineId: result.searchEngineId as string,
        })
      } else {
        resolve(null)
      }
    })
  })
}

export const saveSettings = (settings: ExtensionSettings): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.local.set(settings, () => resolve())
  })
}

export const getQuota = (): Promise<QuotaData> => {
  return new Promise((resolve) => {
    chrome.storage.local.get(['quotaCount', 'quotaDate'], (result) => {
      resolve({
        count: result.quotaCount ?? 0,
        date: result.quotaDate ?? '',
      })
    })
  })
}

export const saveQuota = (data: QuotaData): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.local.set({
      quotaCount: data.count,
      quotaDate: data.date,
    }, () => resolve())
  })
}