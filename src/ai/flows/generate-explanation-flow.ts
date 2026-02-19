'use server';
/**
 * @fileOverview A Genkit flow that generates a personalized recommendation along with a clear, natural language explanation of why the recommendation was made, based on user preferences and constraints.
 *
 * - generateExplanation - A function that handles the recommendation and explanation generation process.
 * - GenerateExplanationInput - The input type for the generateExplanation function.
 * - GenerateExplanationOutput - The return type for the generateExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const GenerateExplanationInputSchema = z.object({
  userPersona: z.string().describe('The persona of the user (e.g., "Student", "Traveler", "Creator").'),
  preferences: z.string().describe('User preferences (e.g., "vegetarian", "events", "retail", "Italian food").'),
  budget: z.number().describe('The maximum budget in numerical value (e.g., 120 for ₹120).'),
  time: z.string().describe('The preferred time (e.g., "lunch", "evening", "anytime").'),
  accessibility: z.string().describe('Accessibility requirements (e.g., "wheelchair accessible", "quiet environment", "none").'),
  recentChoices: z.array(z.string()).describe('A list of recent choices or recommendations to ensure diversity.'),
});
export type GenerateExplanationInput = z.infer<typeof GenerateExplanationInputSchema>;

// Output Schema
const GenerateExplanationOutputSchema = z.object({
  recommendation: z.string().describe('A personalized recommendation (e.g., "Try the new Italian restaurant \'Pasta Palace\'").'),
  costEstimate: z.number().describe('The estimated cost of the recommendation.'),
  timeEstimate: z.string().describe('The estimated time commitment or time it takes to experience the recommendation (e.g., "30-45 minutes", "2 hours").'),
  diversityScore: z.number().min(0).max(100).describe('A score from 0 to 100 indicating how diverse this recommendation is compared to recent choices. Higher is better.'),
  explanation: z
    .string()
    .describe(
      'A natural language explanation of why this recommendation was made, detailing how it aligns with budget, preferences, accessibility, and diversity. Example: "Within your ₹120 budget. Matches your vegetarian preference. Adds variety to recent choices. Highly rated by students."
    ),
});
export type GenerateExplanationOutput = z.infer<typeof GenerateExplanationOutputSchema>;

// Wrapper function for the flow
export async function generateExplanation(
  input: GenerateExplanationInput
): Promise<GenerateExplanationOutput> {
  return generateExplanationFlow(input);
}

// Define the prompt
const explainableRecommendationPrompt = ai.definePrompt({
  name: 'explainableRecommendationPrompt',
  input: { schema: GenerateExplanationInputSchema },
  output: { schema: GenerateExplanationOutputSchema },
  prompt: `You are an Explainable AI Recommendation Engine. Your goal is to provide a personalized recommendation and a clear, concise explanation of why that recommendation was made, based on the user's input.

The explanation should specifically address:
1. How the recommendation fits the user's budget.
2. How it aligns with the user's stated preferences.
3. How it addresses any accessibility requirements.
4. How it provides variety, considering their recent choices, to prevent a filter bubble.
5. Optionally, mention any perceived quality or popularity relevant to the user's persona.

User Persona: {{{userPersona}}}
Preferences: {{{preferences}}}
Budget: {{{budget}}}
Preferred Time: {{{time}}}
Accessibility: {{{accessibility}}}
Recent Choices: {{#if recentChoices}}{{#each recentChoices}}- {{{this}}}
{{/each}}{{else}}None{{/if}}

Based on the above, provide a suitable recommendation, its estimated cost and time, a diversity score, and a detailed explanation.`,
});

// Define the Genkit flow
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
