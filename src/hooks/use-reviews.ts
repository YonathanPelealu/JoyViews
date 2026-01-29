"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ReviewResult } from "@/lib/ai/providers";

interface Review {
  id: string;
  title: string;
  language: string | null;
  provider: string;
  model: string;
  sourceType: string;
  sourceUrl: string | null;
  repoOwner: string | null;
  repoName: string | null;
  prNumber: number | null;
  createdAt: string;
}

interface ReviewDetail extends Review {
  code: string;
  result: ReviewResult;
}

interface ReviewsResponse {
  reviews: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface CreateReviewParams {
  code: string;
  language?: string;
  provider: string;
  model: string;
  title?: string;
  context?: string;
  focusAreas?: string[];
}

interface CreateReviewResponse {
  id: string;
  result: ReviewResult;
}

export function useReviews(page: number = 1, limit: number = 10) {
  return useQuery<ReviewsResponse>({
    queryKey: ["reviews", page, limit],
    queryFn: async () => {
      const response = await fetch(`/api/reviews?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      return response.json();
    },
  });
}

export function useReview(id: string) {
  return useQuery<ReviewDetail>({
    queryKey: ["review", id],
    queryFn: async () => {
      const response = await fetch(`/api/reviews/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch review");
      }
      return response.json();
    },
    enabled: !!id,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation<CreateReviewResponse, Error, CreateReviewParams>({
    mutationFn: async (params) => {
      const response = await fetch("/api/ai/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create review");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const response = await fetch(`/api/reviews?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}
