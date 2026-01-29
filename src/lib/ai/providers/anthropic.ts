import Anthropic from "@anthropic-ai/sdk";
import {
  AIProvider,
  ReviewRequest,
  ReviewResult,
  PROVIDER_CONFIGS,
} from "./base";
import { buildReviewPrompt, parseReviewResponse } from "../prompts/code-review";

function getAnthropicClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY environment variable is not set");
  }
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
}

export const anthropicProvider: AIProvider = {
  name: PROVIDER_CONFIGS.anthropic.name,
  models: PROVIDER_CONFIGS.anthropic.models,

  async review(request: ReviewRequest, model: string): Promise<ReviewResult> {
    const anthropic = getAnthropicClient();
    const prompt = buildReviewPrompt(request);

    const response = await anthropic.messages.create({
      model,
      max_tokens: 4000,
      temperature: 0.8,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      system:
        "You are a savage code reviewer who roasts code like a stand-up comedian. Be brutally funny but technically accurate. Respond with valid JSON only, no markdown formatting.",
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Anthropic");
    }

    const parsed = parseReviewResponse(content.text);

    return {
      ...parsed,
      provider: "anthropic",
      model,
    };
  },
};
