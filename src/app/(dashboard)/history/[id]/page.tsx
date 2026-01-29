"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ReviewResult } from "@/components/review/review-result";
import { formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  ExternalLink,
  FileCode2,
  GitPullRequest,
} from "lucide-react";
import type { ReviewResult as ReviewResultType } from "@/lib/ai/providers";

interface Review {
  id: string;
  title: string;
  code: string;
  language: string | null;
  provider: string;
  model: string;
  result: ReviewResultType;
  sourceType: string;
  sourceUrl: string | null;
  repoOwner: string | null;
  repoName: string | null;
  prNumber: number | null;
  createdAt: string;
}

export default function ReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [review, setReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await fetch(`/api/reviews/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Review not found");
          }
          throw new Error("Failed to fetch review");
        }
        const data = await response.json();
        setReview(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReview();
  }, [id]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="space-y-6">
        <Link href="/history">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to History
          </Button>
        </Link>
        <Card>
          <CardContent className="pt-6 text-center text-destructive">
            {error || "Review not found"}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link href="/history">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              {review.sourceType === "GITHUB_PR" ? (
                <GitPullRequest className="h-5 w-5 text-primary" />
              ) : (
                <FileCode2 className="h-5 w-5 text-primary" />
              )}
              <h1 className="text-2xl font-bold">{review.title}</h1>
            </div>
            <p className="text-muted-foreground">
              {review.provider} / {review.model} • {formatDate(review.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {review.sourceType === "GITHUB_PR" ? "PR" : "Paste"}
          </Badge>
          {review.language && <Badge variant="outline">{review.language}</Badge>}
          {review.sourceUrl && (
            <a
              href={review.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline">
                View Source
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Code */}
        <Card>
          <CardHeader>
            <CardTitle>Reviewed Code</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm max-h-[500px] overflow-y-auto">
              <code>{review.code}</code>
            </pre>
          </CardContent>
        </Card>

        {/* Results */}
        <div>
          <ReviewResult result={review.result} />
        </div>
      </div>
    </div>
  );
}
