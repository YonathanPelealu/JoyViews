"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Repo } from "@/components/github/repo-list";
import type { PullRequest } from "@/components/github/pr-list";
import type { ReviewResult } from "@/lib/ai/providers";

interface PRFile {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  changes: number;
  patch?: string;
}

interface PRDiffResponse {
  pr: {
    number: number;
    title: string;
    state: string;
    url: string;
    author: { login: string; avatarUrl: string };
    head: string;
    base: string;
    additions: number;
    deletions: number;
    changedFiles: number;
  };
  files: PRFile[];
  combinedDiff: string;
}

interface PRReviewParams {
  owner: string;
  repo: string;
  number: number;
  provider: string;
  model: string;
}

interface PRReviewResponse {
  id: string;
  result: ReviewResult;
  pr: {
    number: number;
    title: string;
    url: string;
  };
}

export function useGithubRepos() {
  return useQuery<{ repos: Repo[] }>({
    queryKey: ["github-repos"],
    queryFn: async () => {
      const response = await fetch("/api/github/repos");
      if (!response.ok) {
        throw new Error("Failed to fetch repositories");
      }
      return response.json();
    },
  });
}

export function useGithubPRs(owner: string, repo: string) {
  return useQuery<{ pullRequests: PullRequest[] }>({
    queryKey: ["github-prs", owner, repo],
    queryFn: async () => {
      const response = await fetch(
        `/api/github/prs?owner=${owner}&repo=${repo}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch pull requests");
      }
      return response.json();
    },
    enabled: !!owner && !!repo,
  });
}

export function useGithubPRDiff(owner: string, repo: string, number: number) {
  return useQuery<PRDiffResponse>({
    queryKey: ["github-pr-diff", owner, repo, number],
    queryFn: async () => {
      const response = await fetch(
        `/api/github/diff?owner=${owner}&repo=${repo}&number=${number}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch PR diff");
      }
      return response.json();
    },
    enabled: !!owner && !!repo && !!number,
  });
}

export function useGithubPRReview() {
  const queryClient = useQueryClient();

  return useMutation<PRReviewResponse, Error, PRReviewParams>({
    mutationFn: async (params) => {
      const response = await fetch("/api/github/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to review PR");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}
