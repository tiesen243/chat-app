'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { Loader2Icon, SendIcon } from 'lucide-react'

import { Markdown } from '@/components/markdown'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export const ChatBox = () => {
  const { messages, input, handleInputChange, handleSubmit, status, stop } =
    useChat({})

  const isLoading = useMemo(
    () => status === 'streaming' || status === 'submitted',
    [status],
  )

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const scrollToBottom = useCallback(() => {
    if (isAtBottom)
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [isAtBottom])

  useEffect(() => {
    const target = messagesEndRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAtBottom(entry?.isIntersecting ?? false)
      },
      { threshold: 0.1 },
    )

    observer.observe(target)
    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleFormSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault()
      event.stopPropagation()

      if (isLoading) stop()
      else handleSubmit()
    },
    [isLoading, stop, handleSubmit],
  )

  const renderMessagePart = useCallback(
    (
      part: {
        type: string
        text: string
      },
      messageId: string,
      index: number,
    ) => {
      switch (part.type) {
        case 'text':
          return <Markdown key={`${messageId}-${index}`}>{part.text}</Markdown>
        default:
          return null
      }
    },
    [],
  )

  return (
    <>
      <div className="stretch mx-auto flex w-svh max-w-2xl flex-col items-end gap-4 pt-8 pb-28">
        {messages.map((message) => (
          <Card
            key={message.id}
            className={cn(
              'py-2',
              message.role !== 'user' && 'bg-background w-full border-none p-0',
              message.role === 'user' && 'w-fit',
            )}
          >
            <CardContent
              className={cn(
                'flex flex-col gap-4 px-4 leading-8',
                message.role !== 'user' && 'px-0',
              )}
            >
              {message.parts.map((part, i) =>
                // @ts-expect-error - part.type is not a string
                renderMessagePart(part, message.id, i),
              )}
            </CardContent>
          </Card>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <Card className="border-x-card border-b-card fixed bottom-0 left-0 flex h-24 w-full items-center justify-center rounded-none">
        <form
          onSubmit={handleFormSubmit}
          className="flex w-full max-w-2xl items-center gap-4"
        >
          <Input
            className="h-12"
            placeholder="Say something..."
            onChange={handleInputChange}
            value={input}
            disabled={isLoading}
          />
          <Button size="icon" className="size-12">
            {isLoading ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <SendIcon />
            )}
          </Button>
        </form>
      </Card>
    </>
  )
}
