
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ChatAssistantInputSchema = z.object({
  message: z.string(),
  userProfile: z.any()
});

const ChatAssistantOutputSchema = z.object({
  response: z.string()
});

export async function chatWithAssistant(input: z.infer<typeof ChatAssistantInputSchema>) {
  return chatAssistantFlow(input);
}

const chatAssistantPrompt = ai.definePrompt({
  name: 'chatAssistantPrompt',
  input: { schema: ChatAssistantInputSchema },
  output: { schema: ChatAssistantOutputSchema },
  prompt: `You are a helpful and friendly AI Smart Life Assistant.
User Context: {{{JSONstringify userProfile}}}

User Message: {{{message}}}

Provide a personalized, helpful response. If the user mentions budget or time, keep your suggestions within those bounds.`
});

const chatAssistantFlow = ai.defineFlow(
  {
    name: 'chatAssistantFlow',
    inputSchema: ChatAssistantInputSchema,
    outputSchema: ChatAssistantOutputSchema,
  },
  async (input) => {
    const { output } = await chatAssistantPrompt(input);
    if (!output) throw new Error('Failed to generate response');
    return output;
  }
);
