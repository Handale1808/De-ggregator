export const extractNewsNow = (): string => {
  const sourceEl = document.querySelector(
    '.source, .publisher, [class*="source"], [class*="publisher"], .nn-source, .feed-item-source'
  )
  if (sourceEl?.textContent) {
    return sourceEl.textContent.trim()
  }

  const meta = document.querySelector('meta[property="og:site_name"]')
  if (meta) {
    const content = meta.getAttribute('content')
    if (content && content.toLowerCase() !== 'newsnow') {
      return content
    }
  }

  try {
    const url = new URL(window.location.href)
    const source = url.searchParams.get('source') || 
                   url.searchParams.get('publisher') ||
                   url.searchParams.get('from')
    if (source) {
      return decodeURIComponent(source)
    }

    const pathParts = url.pathname.split('/').filter(Boolean)
    const newsIndex = pathParts.findIndex(p => p === 'news')
    if (newsIndex !== -1 && pathParts[newsIndex + 1]) {
      return decodeURIComponent(pathParts[newsIndex + 1])
        .replace(/-/g, ' ')
    }
  } catch {
    // invalid URL, fall through
  }

  return ''
}