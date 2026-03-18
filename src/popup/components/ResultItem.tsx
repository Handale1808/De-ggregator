import type { SearchResult } from '../../types'

interface Props {
  result: SearchResult
  onOpen: (url: string) => void
}

export default function ResultItem({ result, onOpen }: Props) {
  return (
    <button
      onClick={() => onOpen(result.url)}
      className="w-full text-left px-3 py-2.5 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 group"
    >
      <p className="text-xs font-medium text-gray-800 group-hover:text-blue-600 leading-snug mb-0.5 line-clamp-2">
        {result.title}
      </p>
      <p className="text-xs text-gray-400">{result.domain}</p>
    </button>
  )
}