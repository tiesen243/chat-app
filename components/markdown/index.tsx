import React, { memo } from 'react'
import mdxComponents from 'fumadocs-ui/mdx'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { CodeHighlight } from './code-block'

const remarkPlugins = [remarkGfm]

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={remarkPlugins}
      components={{
        ...mdxComponents,
        code: CodeHighlight as never,
        pre: ({ children }) => <>{children}</>,
      }}
    >
      {children}
    </ReactMarkdown>
  )
}

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children,
)
