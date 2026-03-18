import { getQuota, saveQuota } from './storage'

const DAILY_LIMIT = 100

export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0]
}

export const incrementQuota = async (): Promise<number> => {
  const today = getTodayString()
  const quota = await getQuota()

  const isNewDay = quota.date !== today
  const newCount = isNewDay ? 1 : quota.count + 1

  await saveQuota({
    count: newCount,
    date: today,
  })

  return newCount
}

export const getRemainingQuota = async (): Promise<number> => {
  const today = getTodayString()
  const quota = await getQuota()

  if (quota.date !== today) {
    return DAILY_LIMIT
  }

  return Math.max(0, DAILY_LIMIT - quota.count)
}