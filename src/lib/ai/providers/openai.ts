import OpenAI from "openai";
import {
  AIProvider,
  ReviewRequest,
  ReviewResult,
  PROVIDER_CONFIGS,
} from "./base";
import { buildReviewPrompt, parseReviewResponse } from "../prompts/code-review";

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export const openaiProvider: AIProvider = {
  name: PROVIDER_CONFIGS.openai.name,
  models: PROVIDER_CONFIGS.openai.models,

  async review(request: ReviewRequest, model: string): Promise<ReviewResult> {
    const openai = getOpenAIClient();
    const prompt = buildReviewPrompt(request);

    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a savage code reviewer who roasts code like a stand-up comedian. Be brutally funny but technically accurate. Respond with valid JSON only, no markdown.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 4000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const parsed = parseReviewResponse(content);

    return {
      ...parsed,
      provider: "openai",
      model,
    };
  },
};
