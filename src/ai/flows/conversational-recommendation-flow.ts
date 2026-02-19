'use server';
/**
 * @fileOverview A Genkit flow that interprets natural language queries from users
 * to extract preferences and constraints for personalized recommendations.
 *
 * - conversationalRecommendationAssistant - A function that handles parsing a conversational query.
 * - ConversationalRecommendationAssistantInput - The input type for the conversationalRecommendationAssistant function.
 * - ConversationalRecommendationAssistantOutput - The return type for the conversationalRecommendationAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConversationalRecommendationAssistantInputSchema = z.object({
  query: z.string().describe('The user\'s natural language query describing their preferences and constraints for a recommendation.'),
});
export type ConversationalRecommendationAssistantInput = z.infer<typeof ConversationalRecommendationAssistantInputSchema>;

const ConversationalRecommendationAssistantOutputSchema = z.object({
  category: z.string().optional().describe('The general category of the desired recommendation (e.g., "retail item", "travel destination", "campus event", "meal", "media content", "creator tool").'),
  preferences: z.array(z.string()).optional().describe('A list of keywords or phrases describing the user\'s specific preferences (e.g., "vegetarian", "outdoor", "family-friendly").'),
  budget: z.string().optional().describe('The user\'s specified budget or cost constraint (e.g., "under $100", "inexpensive", "mid-range").'),
  timeConstraint: z.string().optional().describe('Any time-related constraints for the recommendation (e.g., "this evening", "next week", "for lunch", "short").'),
  accessibilityNeeds: z.boolean().optional().describe('Indicates if the user has specific accessibility needs (e.g., "wheelchair accessible", "audio description"). Set to true if mentioned, otherwise omit.'),
  additionalConstraints: z.array(z.string()).optional().describe('Any other specific constraints or requirements mentioned by the user not covered by other fields.'),
  rawQuery: z.string().describe('The original natural language query from the user.'),
});
export type ConversationalRecommendationAssistantOutput = z.infer<typeof ConversationalRecommendationAssistantOutputSchema>;

export async function conversationalRecommendationAssistant(
  input: ConversationalRecommendationAssistantInput
): Promise<ConversationalRecommendationAssistantOutput> {
  return conversationalRecommendationFlow(input);
}

const conversationalRecommendationPrompt = ai.definePrompt({
  name: 'conversationalRecommendationPrompt',
  input: {schema: ConversationalRecommendationAssistantInputSchema},
  output: {schema: ConversationalRecommendationAssistantOutputSchema},
  prompt: `You are an AI assistant designed to interpret user requests for recommendations and extract key preferences and constraints into a structured JSON format.

Based on the user's query, identify and extract the following information. If a piece of information is not explicitly mentioned, omit that field from the output JSON. If a boolean field like 'accessibilityNeeds' is mentioned, set it to true, otherwise omit it.

User Query: {{{query}}}

Ensure your output is a valid JSON object matching the specified schema.`,
});

const conversationalRecommendationFlow = ai.defineFlow(
  {
    name: 'conversationalRecommendationFlow',
    inputSchema: ConversationalRecommendationAssistantInputSchema,
    outputSchema: ConversationalRecommendationAssistantOutputSchema,
  },
  async (input) => {
    const {output} = await conversationalRecommendationPrompt(input);
    return output!;
  }
);
