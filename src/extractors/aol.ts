export const extractAol = (): string => {
  const meta = document.querySelector('meta[property="og:site_name"]')
  if (meta) {
    const content = meta.getAttribute('content')
    if (content && content.toLowerCase() !== 'aol') {
      return content
    }
  }

  const byline = document.querySelector(
    '.caas-author-link, .provider-name, [class*="provider"], [class*="source"], .byline a'
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
        if (!url.hostname.includes('aol')) {
          return url.hostname.replace('www.', '')
        }
      } catch {
        // invalid URL, fall through
      }
    }
  }

  return ''
}