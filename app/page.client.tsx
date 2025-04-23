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
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isAtBottom])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAtBottom(entry?.isIntersecting ?? false)
      },
      { threshold: 0.1 },
    )
    if (messagesEndRef.current) {
      observer.observe(messagesEndRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading, scrollToBottom])

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
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case 'text':
                    return (
                      <Markdown key={`${message.id}-${i}`}>
                        {part.text}
                      </Markdown>
                    )
                }
              })}
            </CardContent>
          </Card>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <Card className="fixed bottom-0 left-0 flex w-full items-center justify-center">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()

            if (isLoading) stop()
            else handleSubmit()
          }}
          className="flex w-full max-w-2xl items-center gap-4"
        >
          <Input
            className="h-12"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
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
