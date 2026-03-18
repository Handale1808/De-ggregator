// src/utils/storage.ts

import type { ExtensionSettings } from '../types'

export const getSettings = (): Promise<ExtensionSettings | null> => {
  return new Promise((resolve) => {
    chrome.storage.local.get(['apiKey'], (result) => {
      if (result.apiKey) {
        resolve({
          apiKey: result.apiKey as string,
        })
      } else {
        resolve(null)
      }
    })
  })
}

export const clearSettings = async (): Promise<void> => {
  await chrome.storage.local.remove('settings')
}

export const saveSettings = (settings: ExtensionSettings): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.local.set(settings, () => resolve())
  })
}