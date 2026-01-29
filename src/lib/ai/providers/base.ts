export interface ReviewRequest {
  code: string;
  language?: string;
  context?: string;
  focusAreas?: string[];
}

export interface ReviewIssue {
  type: "error" | "warning" | "suggestion" | "info";
  title: string;
  description: string;
  lineStart?: number;
  lineEnd?: number;
  suggestion?: string;
}

export interface ReviewResult {
  summary: string;
  issues: ReviewIssue[];
  roasts: string[];
  improvements: string[];
  positives: string[];
  score: number;
  verdict: string;
  provider: string;
  model: string;
}

export interface AIProvider {
  name: string;
  models: AIModel[];
  review(request: ReviewRequest, model: string): Promise<ReviewResult>;
}

export interface AIModel {
  id: string;
  name: string;
  description?: string;
}

export type ProviderName = "openai" | "anthropic";

export const PROVIDER_CONFIGS: Record<
  ProviderName,
  { name: string; models: AIModel[] }
> = {
  openai: {
    name: "OpenAI",
    models: [
      { id: "gpt-4o", name: "GPT-4o", description: "Most capable model" },
      { id: "gpt-4o-mini", name: "GPT-4o Mini", description: "Fast and efficient" },
      { id: "gpt-4-turbo", name: "GPT-4 Turbo", description: "Previous generation" },
    ],
  },
  anthropic: {
    name: "Anthropic",
    models: [
      { id: "claude-sonnet-4-20250514", name: "Claude Sonnet 4", description: "Latest Sonnet" },
      { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet", description: "Balanced performance" },
      { id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku", description: "Fast and efficient" },
    ],
  },
};
