// src/content/extractor.ts

import { extractPublisher, isSupportedSite } from '../extractors'
import type { ExtractedData } from '../types'

const hostname = window.location.hostname

const getResult = (): ExtractedData | null => {
  if (!isSupportedSite(hostname)) {
    return null
  }

  const h1 = document.querySelector('h1')
  let headline = h1?.textContent?.trim() ?? ''

  if (!headline) {
    const h2 = document.querySelector('h2')
    headline = h2?.textContent?.trim() ?? ''
  }

  if (!headline) {
    headline = document.title?.trim() ?? ''
  }

  const publisher = extractPublisher(hostname)

  // Step 1 — canonical tag check
  let directUrl: string | null = null

  const canonicalEl = document.querySelector('link[rel="canonical"]')
  const canonicalHref = canonicalEl?.getAttribute('href') ?? ''
  if (canonicalHref) {
    try {
      const canonicalUrl = new URL(canonicalHref, window.location.origin)
      if (canonicalUrl.hostname !== hostname) {
        directUrl = canonicalUrl.href
      }
    } catch {
      // ignore
    }
  }

  // Step 2 — article link heuristic (only if no canonical found)
  if (!directUrl) {
    const articleKeywords = ['/news/', '/article/', '/story/', '/post/']
    const anchors = Array.from(document.querySelectorAll('a[href]'))
    for (const anchor of anchors) {
      const href = anchor.getAttribute('href') ?? ''
      try {
        const u = new URL(href, window.location.origin)
        if (u.hostname === hostname) continue
        const pathname = u.pathname.toLowerCase()
        if (
          pathname.length > 30 &&
          articleKeywords.some((kw) => pathname.includes(kw))
        ) {
          directUrl = u.href
          break
        }
      } catch {
        // ignore
      }
    }
  }

  const result: ExtractedData = { headline, publisher, directUrl }

  ;(window as Window & { __deaggResult?: ExtractedData }).__deaggResult = result

  return result
}

const cached = (window as Window & { __deaggResult?: ExtractedData }).__deaggResult
cached ?? getResult()