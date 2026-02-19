
'use server';
/**
 * @fileOverview A Genkit flow that generates a personalized recommendation along with a clear, natural language explanation of why the recommendation was made, based on user preferences, constraints, and health conditions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const GenerateExplanationInputSchema = z.object({
  userPersona: z.string().describe('The persona of the user (e.g., "Student", "Traveler", "Creator").'),
  preferences: z.string().describe('User preferences (e.g., "vegetarian", "events", "retail", "Italian food").'),
  healthConditions: z.array(z.string()).optional().describe('Specific health needs or dietary restrictions.'),
  budget: z.number().describe('The maximum budget in numerical value (e.g., 120 for ₹120).'),
  time: z.string().describe('The preferred time (e.g., "lunch", "evening", "anytime").'),
  accessibility: z.string().describe('Accessibility requirements (e.g., "wheelchair accessible", "quiet environment", "none").'),
  recentChoices: z.array(z.string()).describe('A list of recent choices or recommendations to ensure diversity.'),
});
export type GenerateExplanationInput = z.infer<typeof GenerateExplanationInputSchema>;

// Output Schema
const GenerateExplanationOutputSchema = z.object({
  recommendation: z.string().describe('A personalized recommendation.'),
  costEstimate: z.number().describe('The estimated cost of the recommendation.'),
  timeEstimate: z.string().describe('The estimated time commitment.'),
  diversityScore: z.number().min(0).max(100).describe('Diversity score.'),
  explanation: z
    .string()
    .describe(
      'A natural language explanation detailing how it aligns with budget, preferences, accessibility, health needs, and diversity.'
    ),
  imageHint: z.string().describe('A keyword hint for an image search.'),
  logoHint: z.string().optional().describe('A keyword hint for a logo or icon.'),
});
export type GenerateExplanationOutput = z.infer<typeof GenerateExplanationOutputSchema>;

export async function generateExplanation(
  input: GenerateExplanationInput
): Promise<GenerateExplanationOutput> {
  return generateExplanationFlow(input);
}

const explainableRecommendationPrompt = ai.definePrompt({
  name: 'explainableRecommendationPrompt',
  input: { schema: GenerateExplanationInputSchema },
  output: { schema: GenerateExplanationOutputSchema },
  prompt: `You are an Explainable AI Recommendation Engine. Your goal is to provide a personalized recommendation and a clear, concise explanation of why that recommendation was made.

CRITICAL: You MUST strictly adhere to the user's health conditions and dietary restrictions. If they have a health condition like "Diabetes" or an allergy like "Peanuts", your recommendation MUST be safe for them.

The explanation should specifically address:
1. How it aligns with health needs or dietary restrictions: {{#each healthConditions}}{{{this}}}, {{/each}}
2. How it fits the user's budget.
3. How it aligns with preferences.
4. How it addresses accessibility.
5. How it provides variety compared to recent choices: {{#each recentChoices}}- {{{this}}} {{/each}}

User Persona: {{{userPersona}}}
Preferences: {{{preferences}}}
Budget: ₹{{{budget}}}
Preferred Time: {{{time}}}
Accessibility: {{{accessibility}}}

Provide a suitable recommendation with estimated cost, time, and a detailed explanation.`,
});

const generateExplanationFlow = ai.defineFlow(
  {
    name: 'generateExplanationFlow',
    inputSchema: GenerateExplanationInputSchema,
    outputSchema: GenerateExplanationOutputSchema,
  },
  async (input) => {
    const { output } = await explainableRecommendationPrompt(input);
    if (!output) {
        throw new Error('Failed to generate recommendation and explanation.');
    }
    return output;
  }
);
