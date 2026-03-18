// src/extractors/newsbreak.ts

export const extractNewsBreak = (): string => {
  const sourceEl = document.querySelector(
    '.source-name, .publisher-name, [class*="publisher"], [class*="source"], .article-source a'
  )
  if (sourceEl?.textContent) {
    return sourceEl.textContent.trim()
  }

  const meta = document.querySelector('meta[property="og:site_name"]')
  if (meta) {
    const content = meta.getAttribute('content')
    if (content && content.toLowerCase() !== 'newsbreak') {
      return content
    }
  }

  const authorEl = document.querySelector(
    '.article-author, [class*="author"] a, .byline a'
  )
  if (authorEl?.textContent) {
    return authorEl.textContent.trim()
  }

  try {
    const url = new URL(window.location.href)
    const pathParts = url.pathname.split('/').filter(Boolean)
    if (pathParts.length > 0) {
      const potentialSource = pathParts[0]
      if (!potentialSource.match(/^\d+$/)) {
        return potentialSource.replace(/-/g, ' ')
      }
    }
  } catch {
    // invalid URL, fall through
  }

  return ''
}