export const extractGroundNews = (): string => {
  const sourceEl = document.querySelector(
    '.source-title, .publication-name, [class*="source-name"], [class*="publication"], .story-source'
  )
  if (sourceEl?.textContent) {
    return sourceEl.textContent.trim()
  }

  const meta = document.querySelector('meta[property="og:site_name"]')
  if (meta) {
    const content = meta.getAttribute('content')
    if (content && content.toLowerCase() !== 'ground news') {
      return content
    }
  }

  try {
    const url = new URL(window.location.href)
    const pathParts = url.pathname.split('/').filter(Boolean)
    const articleIndex = pathParts.findIndex(p => p === 'article')
    if (articleIndex !== -1 && pathParts[articleIndex + 1]) {
      return decodeURIComponent(pathParts[articleIndex + 1])
        .replace(/-/g, ' ')
    }
  } catch {
    // invalid URL, fall through
  }

  return ''
}