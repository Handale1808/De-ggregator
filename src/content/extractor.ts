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

  const result: ExtractedData = { headline, publisher }

  // Cache result on window so re-injection returns the same value
  ;(window as Window & { __deaggResult?: ExtractedData }).__deaggResult = result

  return result
}

const cached = (window as Window & { __deaggResult?: ExtractedData }).__deaggResult
cached ?? getResult()