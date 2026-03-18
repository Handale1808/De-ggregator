import { extractYahoo } from './yahoo'
import { extractMsn } from './msn'
import { extractGoogleNews } from './google-news'
import { extractBingNews } from './bing-news'
import { extractAol } from './aol'
import { extractNewsBreak } from './newsbreak'
import { extractGroundNews } from './ground-news'
import { extractNewsNow } from './newsnow'

const EXTRACTOR_MAP: Record<string, () => string> = {
  'news.yahoo.com': extractYahoo,
  'www.yahoo.com': extractYahoo,
  'www.msn.com': extractMsn,
  'msn.com': extractMsn,
  'news.google.com': extractGoogleNews,
  'www.bing.com': extractBingNews,
  'www.aol.com': extractAol,
  'aol.com': extractAol,
  'www.newsbreak.com': extractNewsBreak,
  'ground.news': extractGroundNews,
  'www.ground.news': extractGroundNews,
  'www.newsnow.co.uk': extractNewsNow,
  'newsnow.co.uk': extractNewsNow,
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