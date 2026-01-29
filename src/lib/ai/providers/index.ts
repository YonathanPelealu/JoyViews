import { AIProvider, ProviderName, PROVIDER_CONFIGS } from "./base";
import { openaiProvider } from "./openai";
import { anthropicProvider } from "./anthropic";

const providers: Record<ProviderName, AIProvider> = {
  openai: openaiProvider,
  anthropic: anthropicProvider,
};

export function getProvider(name: ProviderName): AIProvider {
  const provider = providers[name];
  if (!provider) {
    throw new Error(`Unknown provider: ${name}`);
  }
  return provider;
}

export function getAllProviders(): Array<{
  id: ProviderName;
  name: string;
  models: Array<{ id: string; name: string; description?: string }>;
}> {
  return Object.entries(PROVIDER_CONFIGS).map(([id, config]) => ({
    id: id as ProviderName,
    name: config.name,
    models: config.models,
  }));
}

export function isValidProvider(name: string): name is ProviderName {
  return name in providers;
}

export function isValidModel(provider: ProviderName, model: string): boolean {
  const config = PROVIDER_CONFIGS[provider];
  return config.models.some((m) => m.id === model);
}

export { type AIProvider, type ProviderName, PROVIDER_CONFIGS } from "./base";
export type {
  ReviewRequest,
  ReviewResult,
  ReviewIssue,
  AIModel,
} from "./base";
