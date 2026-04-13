// src/extractors/ap-news.ts

export const extractApNews = (): string => {
  // AP News articles always come from the Associated Press.
  // Check the og:site_name to confirm we're on an AP News page,
  // then return the canonical publisher name.
  const meta = document.querySelector('meta[property="og:site_name"]')
  if (meta) {
    const content = meta.getAttribute('content')
    if (content && content.toLowerCase().includes('ap news')) {
      return 'The Associated Press'
    }
  }

  // Fallback: check for the author page link structure AP News uses,
  // e.g. <a href="/author/..."> which always points to an AP journalist.
  // In that case the source is still AP, not the individual author.
  const authorLink = document.querySelector('a[href*="/author/"]')
  if (authorLink) {
    return 'The Associated Press'
  }

  // Last resort: confirm via canonical URL that we're on apnews.com
  const canonical = document.querySelector('link[rel="canonical"]')
  if (canonical) {
    const href = canonical.getAttribute('href')
    if (href) {
      try {
        const url = new URL(href)
        if (url.hostname.includes('apnews.com')) {
          return 'The Associated Press'
        }
      } catch {
        // invalid URL, fall through
      }
    }
  }

  return ''
}