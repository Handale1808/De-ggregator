import type { QuotaData } from '../../types'

interface Props {
  quota: QuotaData
}

const DAILY_LIMIT = 100

export default function UsageCounter({ quota }: Props) {
  const remaining = Math.max(0, DAILY_LIMIT - quota.count)
  const isLow = remaining <= 10

  return (
    <div className="text-xs text-gray-500 text-right px-3 py-1 border-t border-gray-100">
      <span className={isLow ? 'text-red-500 font-medium' : ''}>
        {remaining} of {DAILY_LIMIT} searches remaining today
      </span>
    </div>
  )
}