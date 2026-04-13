// src/extractors/index.ts

import { extractYahoo } from "./yahoo";
import { extractMsn } from "./msn";
import { extractAol } from "./aol";
import { extractNewsBreak } from "./newsbreak";
import { extractApNews } from "./apnews";

const EXTRACTOR_MAP: Record<string, () => string> = {
  "news.yahoo.com": extractYahoo,
  "www.yahoo.com": extractYahoo,
  "yahoo.com": extractYahoo,
  "health.yahoo.com": extractYahoo,
  "finance.yahoo.com": extractYahoo,
  "www.yahoo.com/news": extractYahoo,
  "sports.yahoo.com": extractYahoo,
  "entertainment.yahoo.com": extractYahoo, // redirects under main yahoo
  "style.yahoo.com": extractYahoo,
  "tech.yahoo.com": extractYahoo,
  "food.yahoo.com": extractYahoo,
  "movies.yahoo.com": extractYahoo,
  "music.yahoo.com": extractYahoo,
  "tv.yahoo.com": extractYahoo,
  "uk.news.yahoo.com": extractYahoo,
  "au.news.yahoo.com": extractYahoo,
  "in.yahoo.com": extractYahoo,
  "esports.yahoo.com": extractYahoo,
  "fantasysports.yahoo.com": extractYahoo,
  "cricket.yahoo.com": extractYahoo,
  "www.msn.com": extractMsn,
  "msn.com": extractMsn,
  "www.aol.com": extractAol,
  "aol.com": extractAol,
  "www.newsbreak.com": extractNewsBreak,
  "newsbreak.com": extractNewsBreak,
  "apnews.com": extractApNews,
  "ap.org": extractApNews,
};

export const isSupportedSite = (hostname: string): boolean => {
  return hostname in EXTRACTOR_MAP;
};

export const extractPublisher = (hostname: string): string => {
  const extractor = EXTRACTOR_MAP[hostname];
  if (!extractor) return "";
  try {
    return extractor();
  } catch {
    return "";
  }
};
