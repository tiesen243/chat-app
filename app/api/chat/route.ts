import type { CoreMessage } from 'ai'
import type { NextRequest } from 'next/server'
import { streamText } from 'ai'

import { model } from '@/server/ai'

export const maxDuration = 30

export const POST = async (req: NextRequest) => {
  const { messages } = (await req.json()) as { messages: CoreMessage[] }

  const result = streamText({
    model,
    messages,
    maxRetries: 1,
  })

  return result.toDataStreamResponse()
}
