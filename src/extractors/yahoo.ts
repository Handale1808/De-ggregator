// src/extractors/yahoo.ts

export const extractYahoo = (): string => {
  const meta = document.querySelector('meta[property="og:site_name"]')
  if (meta) {
    const content = meta.getAttribute('content')
    if (content && content.toLowerCase() !== 'yahoo') {
      return content
    }
  }

  const byline = document.querySelector(
    '[data-ylk*="subsec:byline"] a, .caas-author-link, .provider-name'
  )
  if (byline?.textContent) {
    return byline.textContent.trim()
  }

  const canonical = document.querySelector('link[rel="canonical"]')
  if (canonical) {
    const href = canonical.getAttribute('href')
    if (href) {
      try {
        const url = new URL(href)
        if (!url.hostname.includes('yahoo')) {
          return url.hostname.replace('www.', '')
        }
      } catch {
        // invalid URL, fall through
      }
    }
  }

  return ''
}