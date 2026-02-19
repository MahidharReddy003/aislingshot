import { config } from 'dotenv';
config();

import '@/ai/flows/conversational-recommendation-flow.ts';
import '@/ai/flows/generate-explanation-flow.ts';
import '@/ai/flows/refine-explanation-with-feedback-flow.ts';