import React from "react"

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g

export function renderLinks(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  LINK_RE.lastIndex = 0
  while ((match = LINK_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }
    const [, label, url] = match
    const external = /^https?:\/\//.test(url)
    nodes.push(
      <a
        key={nodes.length}
        href={url}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="text-anakiwa-500 hover:underline"
      >
        {label}
      </a>
    )
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return nodes
}
