import { getSettings } from '../utils/storage'
import { incrementQuota, getRemainingQuota } from '../utils/quota'
import type { SearchResult, MessageType } from '../types'

const searchGoogle = async (
  query: string,
  apiKey: string,
  searchEngineId: string
): Promise<SearchResult[]> => {
  const url = new URL('https://www.googleapis.com/customsearch/v1')
  url.searchParams.set('key', apiKey)
  url.searchParams.set('cx', searchEngineId)
  url.searchParams.set('q', query)
  url.searchParams.set('num', '5')

  const response = await fetch(url.toString())

  if (response.status === 429) {
    throw new Error('QUOTA_EXCEEDED')
  }

  if (response.status === 403 || response.status === 400) {
    throw new Error('INVALID_KEY')
  }

  if (!response.ok) {
    throw new Error('SEARCH_FAILED')
  }

  const data = await response.json()

  if (!data.items || data.items.length === 0) {
    return []
  }

  return data.items.slice(0, 5).map((item: {
    title: string
    displayLink: string
    link: string
  }) => ({
    title: item.title,
    domain: item.displayLink,
    url: item.link,
  }))
}

chrome.runtime.onMessage.addListener((message: MessageType, _sender, sendResponse) => {
  if (message.type !== 'SEARCH') return

  const tabId = message.tabId

  ;(async () => {
    try {
      const settings = await getSettings()

      if (!settings) {
        sendResponse({ type: 'SEARCH_ERROR', error: 'NO_SETTINGS' })
        return
      }

      const results = await chrome.scripting.executeScript({
        target: { tabId },
        files: ['content.js'],
      })

      const extracted = results?.[0]?.result

      if (!extracted) {
        sendResponse({ type: 'NOT_SUPPORTED' })
        return
      }

      const query = extracted.publisher
        ? `${extracted.headline} ${extracted.publisher}`
        : extracted.headline

      const searchResults = await searchGoogle(
        query,
        settings.apiKey,
        settings.searchEngineId
      )

      await incrementQuota()
      const remaining = await getRemainingQuota()

      sendResponse({
        type: 'SEARCH_RESULTS',
        results: searchResults,
        quotaUsed: 100 - remaining,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR'
      sendResponse({ type: 'SEARCH_ERROR', error: message })
    }
  })()

  return true
})