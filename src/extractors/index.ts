import { extractYahoo } from './yahoo'
import { extractMsn } from './msn'
import { extractAol } from './aol'
import { extractNewsBreak } from './newsbreak'

const EXTRACTOR_MAP: Record<string, () => string> = {
  'news.yahoo.com': extractYahoo,
  'www.yahoo.com': extractYahoo,
  'yahoo.com': extractYahoo,
  'health.yahoo.com': extractYahoo,
  'www.yahoo.com/news': extractYahoo,
  'www.msn.com': extractMsn,
  'msn.com': extractMsn,
  'www.aol.com': extractAol,
  'aol.com': extractAol,
  'www.newsbreak.com': extractNewsBreak,
  'newsbreak.com': extractNewsBreak,
}

export const isSupportedSite = (hostname: string): boolean => {
  return hostname in EXTRACTOR_MAP
}

export const extractPublisher = (hostname: string): string => {
  const extractor = EXTRACTOR_MAP[hostname]
  if (!extractor) return ''
  try {
    return extractor()
  } catch {
    return ''
  }
}