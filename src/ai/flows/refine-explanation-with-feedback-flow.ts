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
  userFeedback: z.string().describe('The specific feedback or opinion provided by the user on the recommendation.'),
  userPreferences: z.object({
    budget: z.string().optional().describe('The user\'s budget preference (e.g., "low", "medium", "high" or a specific currency amount).'),
    timeConstraint: z.string().optional().describe('The user\'s time constraint preference (e.g., "short", "long", "2 hours").'),
    accessibility: z.array(z.string()).optional().describe('A list of accessibility needs (e.g., "wheelchair accessible", "audio descriptions").'),
    preferenceType: z.array(z.string()).optional().describe('Specific item preferences (e.g., "vegetarian", "vegan", "gluten-free").'),
    discoveryLevel: z.string().optional().describe('The user\'s preference for discovery vs. familiarity (e.g., "high", "medium", "low").')
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
  prompt: `You are an AI system designed to provide transparent and budget-aware recommendations.
Your goal is to acknowledge user feedback on a previous recommendation and explain how this feedback will influence future recommendations and their explanations to better suit the user's needs.

Here is the context:
Original Recommendation:
{{{originalRecommendation}}}

Original Explanation:
{{{originalExplanation}}}

User Feedback: "{{{userFeedback}}}"

Current User Preferences (if available):
{{#if userPreferences}}
  Budget: {{userPreferences.budget}}
  Time Constraint: {{userPreferences.timeConstraint}}
  Accessibility: {{#each userPreferences.accessibility}}- {{{this}}}
  {{/each}}
  Preference Type: {{#each userPreferences.preferenceType}}- {{{this}}}
  {{/each}}
  Discovery Level: {{userPreferences.discoveryLevel}}
{{else}}
  No specific user preferences provided for this context.
{{/if}}

Based on the User Feedback and the Original Recommendation/Explanation, provide a 'refinedExplanation' that addresses the feedback directly.
Also, provide 'actionableInsights' as a list of concrete ways the recommendation system could adjust its logic or user preferences for future interactions.

If the feedback indicates high satisfaction (e.g., "Relevant"), acknowledge that and suggest maintaining similar recommendation parameters.
If "Not useful", consider broader exploration or re-evaluation of core preferences.
If "Too expensive", suggest a stricter budget filter for future recommendations.
If "Too repetitive", suggest increasing diversity or exploring new categories.
If the feedback is a custom opinion, address it specifically and empatheticly.

Ensure the 'refinedExplanation' sounds empathetic, helpful, and forward-looking.`
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
    return output!;
  }
);
