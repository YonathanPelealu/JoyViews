import { z } from "zod";

export const reviewRequestSchema = z.object({
  code: z.string().min(1, "Code is required").max(100000, "Code is too long"),
  language: z.string().optional(),
  context: z.string().max(2000, "Context is too long").optional(),
  focusAreas: z.array(z.string()).max(10).optional(),
  provider: z.enum(["openai", "anthropic"]).default("openai"),
  model: z.string().min(1, "Model is required"),
  title: z.string().max(200, "Title is too long").optional(),
});

export type ReviewRequestInput = z.infer<typeof reviewRequestSchema>;

export const saveReviewSchema = z.object({
  code: z.string().min(1),
  language: z.string().optional(),
  provider: z.string(),
  model: z.string(),
  result: z.string(),
  title: z.string().optional(),
  sourceType: z.enum(["PASTE", "GITHUB_PR", "GITHUB_FILE"]).default("PASTE"),
  sourceUrl: z.string().url().optional(),
  prNumber: z.number().int().positive().optional(),
  repoOwner: z.string().optional(),
  repoName: z.string().optional(),
});

export type SaveReviewInput = z.infer<typeof saveReviewSchema>;

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

export const githubRepoSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
});

export const githubPrSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  number: z.coerce.number().int().positive(),
});

export type GithubRepoInput = z.infer<typeof githubRepoSchema>;
export type GithubPrInput = z.infer<typeof githubPrSchema>;
