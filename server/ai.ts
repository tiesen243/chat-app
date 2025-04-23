import { createOpenAICompatible } from '@ai-sdk/openai-compatible'

const lmstudio = createOpenAICompatible({
  name: 'lmstudio',
  baseURL: 'http://localhost:1234/v1',
})

export const model = lmstudio('gemma-3-4b-it:2')
