import { useState } from 'react'
import type { SearchResult } from '../../types'

interface Props {
  result: SearchResult
  onOpen: (url: string) => void
  index?: number
}

export default function ResultItem({ result, onOpen, index = 0 }: Props) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={() => onOpen(result.url)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full text-left px-3 py-2.5 last:border-b-0"
      style={{
        backgroundColor: hovered ? "var(--bg-surface-hover)" : "var(--bg-surface)",
        borderBottom: "1px solid var(--border-dim)",
        animation: "fade-up 0.2s ease both",
        animationDelay: `${index * 40}ms`,
      }}
    >
      <p
        className="text-xs font-medium leading-snug mb-0.5 line-clamp-2 transition-colors duration-150"
        style={{
          color: hovered ? "var(--accent)" : "var(--text-primary)",
          textShadow: hovered ? "var(--accent-glow)" : "none",
        }}
      >
        {result.title}
      </p>
      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
        {result.domain}
      </p>
      <p
        className="text-xs truncate max-w-full transition-opacity duration-150"
        style={{
          color: "var(--accent)",
          opacity: hovered ? 0.6 : 0,
        }}
      >
        {result.url}
      </p>
    </button>
  )
}