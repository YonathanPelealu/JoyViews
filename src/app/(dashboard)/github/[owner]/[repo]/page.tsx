"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PRList, PullRequest } from "@/components/github/pr-list";
import { ArrowLeft } from "lucide-react";

export default function RepoPRsPage({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}) {
  const { owner, repo } = use(params);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPRs = async () => {
      try {
        const response = await fetch(
          `/api/github/prs?owner=${owner}&repo=${repo}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch pull requests");
        }
        const data = await response.json();
        setPullRequests(data.pullRequests);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPRs();
  }, [owner, repo]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/github">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">
            {owner}/{repo}
          </h1>
          <p className="text-muted-foreground mt-1">
            Select a pull request to review
          </p>
        </div>
      </div>

      {error ? (
        <div className="text-center text-destructive py-8">{error}</div>
      ) : (
        <PRList
          pullRequests={pullRequests}
          owner={owner}
          repo={repo}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
