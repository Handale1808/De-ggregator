export const extractBingNews = (): string => {
  const sourceEl = document.querySelector(
    '.source, .SourceLink, [class*="source"], .provider, .newsSourceAnchor'
  )
  if (sourceEl?.textContent) {
    return sourceEl.textContent.trim()
  }

  const meta = document.querySelector('meta[property="og:site_name"]')
  if (meta) {
    const content = meta.getAttribute('content')
    if (content && content.toLowerCase() !== 'bing' && content.toLowerCase() !== 'msn') {
      return content
    }
  }

  try {
    const url = new URL(window.location.href)
    const source = url.searchParams.get('source') || url.searchParams.get('src')
    if (source) {
      return decodeURIComponent(source)
    }
  } catch {
    // invalid URL, fall through
  }

  return ''
}