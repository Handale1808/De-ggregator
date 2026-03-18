import { extractPublisher, isSupportedSite } from '../extractors'
import type { ExtractedData } from '../types'

const extract = (): ExtractedData | null => {
  const hostname = window.location.hostname

  if (!isSupportedSite(hostname)) {
    return null
  }

  const h1 = document.querySelector('h1')
  const headline = h1?.textContent?.trim() ?? ''

  if (!headline) {
    const h2 = document.querySelector('h2')
    const fallback = h2?.textContent?.trim() ?? ''
    if (!fallback) {
      const title = document.title?.trim() ?? ''
      return {
        headline: title,
        publisher: extractPublisher(hostname),
      }
    }
    return {
      headline: fallback,
      publisher: extractPublisher(hostname),
    }
  }

  return {
    headline,
    publisher: extractPublisher(hostname),
  }
}

export default extract()