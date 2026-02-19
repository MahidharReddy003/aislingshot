'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ChatAssistantInputSchema = z.object({
  message: z.string(),
  userProfile: z.object({
    name: z.string().optional(),
    role: z.string().optional(),
    interests: z.array(z.string()).optional(),
    location: z.string().optional(),
    budgetPreference: z.number().optional(),
    aiBehavior: z.string().optional(),
    availableTime: z.number().optional()
  })
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

User Profile Info:
- Name: {{{userProfile.name}}}
- Role: {{{userProfile.role}}}
- Interests: {{#each userProfile.interests}}{{{this}}}, {{/each}}
- Location: {{{userProfile.location}}}
- Daily Budget: ₹{{{userProfile.budgetPreference}}}
- AI Tone: {{{userProfile.aiBehavior}}}

User Message: {{{message}}}

Provide a personalized, helpful response based on the above profile. If the user mentions budget or time, keep your suggestions within those bounds.`
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
