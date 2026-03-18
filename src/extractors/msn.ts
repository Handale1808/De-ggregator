// src/extractors/msn.ts

export const extractMsn = (): string => {
  const providerEl = document.querySelector('[data-t*="c.b"]');
  if (providerEl) {
    try {
      const dataT = JSON.parse(providerEl.getAttribute("data-t") ?? "{}");
      const publisher = (dataT["c.b"] as string | undefined)?.trim() ?? "";
      if (publisher) return publisher;
    } catch {
      // fall through
    }
  }

  const providerEl2 = document.querySelector(
    '.authortext, .source, [class*="provider"], [class*="source-name"], .displayProvider'
  );
  if (providerEl2?.textContent) {
    return providerEl2.textContent.trim();
  }

  const meta = document.querySelector('meta[property="og:site_name"]');
  if (meta) {
    const content = meta.getAttribute('content');
    if (content && content.toLowerCase() !== 'msn') {
      return content;
    }
  }

  try {
    const url = new URL(window.location.href);
    const pathParts = url.pathname.split('/');
    const sourceIndex = pathParts.findIndex(p => p === 'source');
    if (sourceIndex !== -1 && pathParts[sourceIndex + 1]) {
      return decodeURIComponent(pathParts[sourceIndex + 1]);
    }

    const channelMatch = url.pathname.match(/\/([^/]+)\/sr-vid-/);
    if (channelMatch) {
      return decodeURIComponent(channelMatch[1]);
    }
  } catch {
    // fall through
  }

  return '';
};