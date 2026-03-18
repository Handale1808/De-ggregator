import type { SearchResult } from '../../types'
import ResultItem from './ResultItem'

interface Props {
  results: SearchResult[]
  onOpen: (url: string) => void
}

export default function ResultsList({ results, onOpen }: Props) {
  if (results.length === 0) {
    return (
      <div className="px-3 py-6 text-center">
        <p className="text-xs text-gray-500">
          No results found for this article.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Try opening the article in its own tab and searching again.
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-100">
      {results.map((result, index) => (
        <ResultItem
          key={index}
          result={result}
          onOpen={onOpen}
        />
      ))}
    </div>
  )
}