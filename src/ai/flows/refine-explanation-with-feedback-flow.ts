'use server';
/**
 * @fileOverview This file defines a Genkit flow for refining AI explanations based on user feedback.
 *
 * - refineExplanationWithFeedback - A function that refines an explanation and provides actionable insights based on user feedback.
 * - RefineExplanationWithFeedbackInput - The input type for the refineExplanationWithFeedback function.
 * - RefineExplanationWithFeedbackOutput - The return type for the refineExplanationWithFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineExplanationWithFeedbackInputSchema = z.object({
  originalRecommendation: z.string().describe('The text of the original recommendation provided to the user.'),
  originalExplanation: z.string().describe('The initial explanation given for the recommendation.'),
  userFeedback: z.enum(['Relevant', 'Not useful', 'Too expensive', 'Too repetitive']).describe('The specific feedback provided by the user on the recommendation.'),
  userPreferences: z.object({
    budget: z.string().optional().describe('The user\u0027s budget preference (e.g., "low", "medium", "high" or a specific currency amount).'),
    timeConstraint: z.string().optional().describe('The user\u0027s time constraint preference (e.g., "short", "long", "2 hours").'),
    accessibility: z.array(z.string()).optional().describe('A list of accessibility needs (e.g., "wheelchair accessible", "audio descriptions").'),
    preferenceType: z.array(z.string()).optional().describe('Specific item preferences (e.g., "vegetarian", "vegan", "gluten-free").'),
    discoveryLevel: z.string().optional().describe('The user\u0027s preference for discovery vs. familiarity (e.g., "high", "medium", "low").')
  }).optional().describe('The current preferences of the user that influenced the original recommendation.')
});
export type RefineExplanationWithFeedbackInput = z.infer<typeof RefineExplanationWithFeedbackInputSchema>;

const RefineExplanationWithFeedbackOutputSchema = z.object({
  refinedExplanation: z.string().describe('A new, refined explanation that acknowledges the feedback and suggests how future recommendations might be adjusted.'),
  actionableInsights: z.array(z.string()).describe('A list of insights derived from the feedback, suggesting concrete ways the system could adapt for future recommendations.')
});
export type RefineExplanationWithFeedbackOutput = z.infer<typeof RefineExplanationWithFeedbackOutputSchema>;

export async function refineExplanationWithFeedback(input: RefineExplanationWithFeedbackInput): Promise<RefineExplanationWithFeedbackOutput> {
  return refineExplanationWithFeedbackFlow(input);
}

const refineExplanationWithFeedbackPrompt = ai.definePrompt({
  name: 'refineExplanationWithFeedbackPrompt',
  input: {schema: RefineExplanationWithFeedbackInputSchema},
  output: {schema: RefineExplanationWithFeedbackOutputSchema},
  prompt: `You are an AI system designed to provide transparent and budget-aware recommendations.\nYour goal is to acknowledge user feedback on a previous recommendation and explain how this feedback will influence future recommendations and their explanations to better suit the user's needs.\n\nHere is the context:\nOriginal Recommendation:\n{{{originalRecommendation}}}\n\nOriginal Explanation:\n{{{originalExplanation}}}\n\nUser Feedback: "{{{userFeedback}}}"\n\nCurrent User Preferences (if available):\n{{#if userPreferences}}\n  Budget: {{userPreferences.budget}}\n  Time Constraint: {{userPreferences.timeConstraint}}\n  Accessibility: {{#each userPreferences.accessibility}}- {{{this}}}\n  {{/each}}\n  Preference Type: {{#each userPreferences.preferenceType}}- {{{this}}}\n  {{/each}}\n  Discovery Level: {{userPreferences.discoveryLevel}}\n{{else}}\n  No specific user preferences provided for this context.\n{{/if}}\n\nBased on the User Feedback and the Original Recommendation/Explanation, provide a 'refinedExplanation' that addresses the feedback directly.\nAlso, provide 'actionableInsights' as a list of concrete ways the recommendation system could adjust its logic or user preferences for future interactions.\n\nIf the feedback is "Relevant", acknowledge that and suggest maintaining similar recommendation parameters.\nIf "Not useful", consider broader exploration or re-evaluation of core preferences.\nIf "Too expensive", suggest a stricter budget filter for future recommendations.\nIf "Too repetitive", suggest increasing diversity or exploring new categories.\n\nEnsure the 'refinedExplanation' sounds empathetic, helpful, and forward-looking.`
});

const refineExplanationWithFeedbackFlow = ai.defineFlow(
  {
    name: 'refineExplanationWithFeedbackFlow',
    inputSchema: RefineExplanationWithFeedbackInputSchema,
    outputSchema: RefineExplanationWithFeedbackOutputSchema,
  },
  async (input) => {
    const {output} = await refineExplanationWithFeedbackPrompt(input);
    if (!output) {
      throw new Error('Failed to generate refined explanation.');
    }
    return output;
  }
);
