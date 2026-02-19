
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PlanDayInputSchema = z.object({
  budget: z.number(),
  timeAvailable: z.number(),
  userProfile: z.object({
    interests: z.array(z.string()),
    healthConditions: z.array(z.string()).optional(),
    location: z.string(),
    role: z.string()
  })
});

const PlanDayOutputSchema = z.object({
  activities: z.array(z.object({
    title: z.string(),
    description: z.string(),
    cost: z.number(),
    durationMinutes: z.number(),
    reason: z.string(),
    imageHint: z.string().describe('A one or two word keyword hint for an image search.'),
    logoHint: z.string().optional().describe('A keyword hint for a logo or icon.')
  })),
  totalCost: z.number(),
  summary: z.string()
});

export async function planDay(input: z.infer<typeof PlanDayInputSchema>) {
  return planDayFlow(input);
}

const planDayPrompt = ai.definePrompt({
  name: 'planDayPrompt',
  input: { schema: PlanDayInputSchema },
  output: { schema: PlanDayOutputSchema },
  prompt: `You are an AI Smart Life Assistant. 

CRITICAL: You MUST strictly respect the user's health conditions and dietary restrictions: {{#each userProfile.healthConditions}}{{{this}}}, {{/each}}

User Profile:
- Interests: {{#each userProfile.interests}}{{{this}}}, {{/each}}
- Location: {{{userProfile.location}}}
- Role: {{{userProfile.role}}}

User Constraints:
- Budget: ₹{{{budget}}}
- Time: {{{timeAvailable}}} minutes

Generate a personalized plan including what to eat, where to go, and what to do. 
Ensure the plan is safe and suitable based on health conditions.
For each activity, provide a clear "reason" based on interests and health needs.`
});

const planDayFlow = ai.defineFlow(
  {
    name: 'planDayFlow',
    inputSchema: PlanDayInputSchema,
    outputSchema: PlanDayOutputSchema,
  },
  async (input) => {
    const { output } = await planDayPrompt(input);
    if (!output) throw new Error('Failed to generate plan');
    return output;
  }
);
