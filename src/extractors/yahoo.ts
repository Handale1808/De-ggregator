// src/extractors/yahoo.ts

export const extractYahoo = (): string => {
  // 1. JSON-LD structured data. Yahoo exposes the upstream source here
  //    as `provider.name`, with `publisher.name` reserved for Yahoo itself.
  const jsonLdScripts = document.querySelectorAll<HTMLScriptElement>(
    'script[type="application/ld+json"]'
  )
  for (const script of jsonLdScripts) {
    try {
      const data = JSON.parse(script.textContent ?? '')
      const candidates = [data?.provider?.name, data?.publisher?.name]
      for (const name of candidates) {
        if (
          typeof name === 'string' &&
          name.trim() &&
          !name.toLowerCase().includes('yahoo')
        ) {
          return name.trim()
        }
      }
    } catch {
      // malformed JSON, try next script
    }
  }

  // 2. Provider anchor. Works on finance.yahoo.com via aria-label/title,
  //    and on news.yahoo.com via the brand profile URL slug or img alt.
  const providerLink = document.querySelector<HTMLAnchorElement>(
    'a[data-ylk*="logo-provider"]'
  )
  if (providerLink) {
    const label =
      providerLink.getAttribute('aria-label') ??
      providerLink.getAttribute('title') ??
      ''
    if (label.trim()) return label.trim()

    const href = providerLink.getAttribute('href') ?? ''
    const slugMatch = href.match(/\/brands\/([^/?#]+)/)
    if (slugMatch) {
      return slugMatch[1].replace(/-/g, ' ').trim()
    }

    const img = providerLink.querySelector('img')
    const alt = img?.getAttribute('alt') ?? ''
    if (alt.trim() && !alt.toLowerCase().includes('yahoo')) {
      return alt.trim()
    }
  }

  // 3. Finance-specific provider logo, scoped to article header so
  //    figcaption photo credits don't get picked up by accident.
  const providerImg = document.querySelector<HTMLImageElement>(
    '.top-header img.provider-logo, .cover-wrap img.provider-logo'
  )
  if (providerImg) {
    const alt = providerImg.getAttribute('alt') ?? ''
    if (alt.trim()) return alt.trim()
  }

  // 4. og:site_name as a fallback, skipping Yahoo's own brands.
  const meta = document.querySelector('meta[property="og:site_name"]')
  if (meta) {
    const content = meta.getAttribute('content') ?? ''
    if (content && !content.toLowerCase().includes('yahoo')) {
      return content
    }
  }

  // 5. Canonical URL pointing off yahoo.* hostnames.
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
        // invalid URL
      }
    }
  }

  return ''
}