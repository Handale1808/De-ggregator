export const extractGoogleNews = (): string => {
  const sourceEl = document.querySelector(
    'div[data-n-tid] a, .SVJrMe, [class*="source"], .wEwyrc, a[data-ved] ~ div'
  )
  if (sourceEl?.textContent) {
    return sourceEl.textContent.trim()
  }

  const timeEl = document.querySelector('time')
  if (timeEl) {
    const prev = timeEl.previousElementSibling
    if (prev?.textContent) {
      return prev.textContent.trim()
    }
  }

  const meta = document.querySelector('meta[property="og:site_name"]')
  if (meta) {
    const content = meta.getAttribute('content')
    if (content && content.toLowerCase() !== 'google news') {
      return content
    }
  }

  return ''
}