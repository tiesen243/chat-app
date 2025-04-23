import { useMemo } from 'react'
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock'

interface CodeHighlightProps {
  className?: string
  children?: React.ReactNode
  node: {
    position: {
      start: { line: number; column: number }
      end: { line: number; column: number }
    }
  }
}

export const CodeHighlight = ({
  className,
  children,
  node,
}: CodeHighlightProps) => {
  const match = className?.match(/language-(\w+)/)
  const language = match ? match[1] : 'text'
  const isInline = useMemo(() => {
    if (node.position.start.line === node.position.end.line) return true
    return false
  }, [node.position.end.line, node.position.start.line])

  const code =
    typeof children === 'string'
      ? children
      : children instanceof Array
        ? children
            .map((child) => (typeof child === 'string' ? child : ''))
            .join('')
        : ''

  if (isInline)
    return <code className="bg-secondary rounded text-sm">{code}</code>
  return <DynamicCodeBlock lang={language ?? 'text'} code={code.trim()} />
}
