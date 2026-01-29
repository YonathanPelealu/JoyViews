"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProviderSelector } from "@/components/review/provider-selector";
import { ReviewResult } from "@/components/review/review-result";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  ExternalLink,
  Loader2,
  Sparkles,
  GitPullRequest,
} from "lucide-react";
import type { ReviewResult as ReviewResultType } from "@/lib/ai/providers";

interface PRDetails {
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
}

interface PRFile {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  changes: number;
  patch?: string;
}

export default function PRReviewPage({
  params,
}: {
  params: Promise<{ owner: string; repo: string; number: string }>;
}) {
  const { owner, repo, number } = use(params);
  const [prDetails, setPRDetails] = useState<PRDetails | null>(null);
  const [files, setFiles] = useState<PRFile[]>([]);
  const [isLoadingPR, setIsLoadingPR] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [provider, setProvider] = useState("openai");
  const [model, setModel] = useState("gpt-4o");
  const [isReviewing, setIsReviewing] = useState(false);
  const [result, setResult] = useState<ReviewResultType | null>(null);

  useEffect(() => {
    const fetchPRDetails = async () => {
      try {
        const response = await fetch(
          `/api/github/diff?owner=${owner}&repo=${repo}&number=${number}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch PR details");
        }
        const data = await response.json();
        setPRDetails(data.pr);
        setFiles(data.files);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoadingPR(false);
      }
    };

    fetchPRDetails();
  }, [owner, repo, number]);

  const handleReview = async () => {
    setIsReviewing(true);
    setResult(null);

    try {
      const response = await fetch("/api/github/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner,
          repo,
          number: parseInt(number),
          provider,
          model,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to process review");
      }

      const data = await response.json();
      setResult(data.result);

      toast({
        title: "Review Complete",
        description: "The pull request has been reviewed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to process review",
        variant: "destructive",
      });
    } finally {
      setIsReviewing(false);
    }
  };

  if (isLoadingPR) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error || !prDetails) {
    return (
      <div className="space-y-6">
        <Link href={`/github/${owner}/${repo}`}>
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to PRs
          </Button>
        </Link>
        <div className="text-center text-destructive py-8">
          {error || "PR not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/github/${owner}/${repo}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <GitPullRequest className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-bold">{prDetails.title}</h1>
            </div>
            <p className="text-muted-foreground">
              {owner}/{repo} #{number}
            </p>
          </div>
        </div>
        <a href={prDetails.url} target="_blank" rel="noopener noreferrer">
          <Button variant="outline">
            View on GitHub
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </a>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* PR Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pull Request Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  variant={prDetails.state === "open" ? "success" : "secondary"}
                  className="capitalize"
                >
                  {prDetails.state}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Author</span>
                <span>{prDetails.author.login}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Branch</span>
                <span className="text-sm">
                  {prDetails.head} → {prDetails.base}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Changes</span>
                <span>
                  <span className="text-green-500">+{prDetails.additions}</span>{" "}
                  <span className="text-red-500">-{prDetails.deletions}</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Files Changed</span>
                <span>{prDetails.changedFiles}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changed Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {files.map((file) => (
                  <div
                    key={file.filename}
                    className="flex items-center justify-between text-sm p-2 rounded hover:bg-muted"
                  >
                    <span className="truncate flex-1">{file.filename}</span>
                    <span className="ml-2 text-xs">
                      <span className="text-green-500">+{file.additions}</span>{" "}
                      <span className="text-red-500">-{file.deletions}</span>
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Review Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProviderSelector
                provider={provider}
                model={model}
                onProviderChange={setProvider}
                onModelChange={setModel}
                disabled={isReviewing}
              />

              <Button
                onClick={handleReview}
                disabled={isReviewing}
                className="w-full"
                size="lg"
              >
                {isReviewing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Reviewing PR...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Review Pull Request
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Review Result */}
        <div className="lg:col-span-2">
          {result ? (
            <ReviewResult result={result} />
          ) : (
            <Card className="h-full min-h-[400px] flex items-center justify-center">
              <CardContent className="text-center text-muted-foreground">
                <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Ready to Review</p>
                <p className="text-sm">
                  Click &quot;Review Pull Request&quot; to analyze the changes
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
