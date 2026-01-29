"use client";

import Link from "next/link";
import { GitPullRequest, GitMerge, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRelativeTime } from "@/lib/utils";

export interface PullRequest {
  id: number;
  number: number;
  title: string;
  state: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  author: {
    login: string;
    avatarUrl: string;
  };
  head: string;
  base: string;
  additions: number;
  deletions: number;
  changedFiles: number;
}

interface PRListProps {
  pullRequests: PullRequest[];
  owner: string;
  repo: string;
  isLoading?: boolean;
}

function PRSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-5 w-2/3" />
        </div>
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
    </Card>
  );
}

function PRIcon({ state }: { state: string }) {
  switch (state) {
    case "open":
      return <GitPullRequest className="h-4 w-4 text-green-500" />;
    case "closed":
      return <XCircle className="h-4 w-4 text-red-500" />;
    case "merged":
      return <GitMerge className="h-4 w-4 text-purple-500" />;
    default:
      return <GitPullRequest className="h-4 w-4" />;
  }
}

function PRBadge({ state }: { state: string }) {
  const variants: Record<string, "success" | "destructive" | "default"> = {
    open: "success",
    closed: "destructive",
    merged: "default",
  };

  return (
    <Badge variant={variants[state] || "default"} className="capitalize">
      {state}
    </Badge>
  );
}

export function PRList({ pullRequests, owner, repo, isLoading }: PRListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <PRSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (pullRequests.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          No pull requests found
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {pullRequests.map((pr) => (
        <Link key={pr.id} href={`/github/pr/${owner}/${repo}/${pr.number}`}>
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-2 min-w-0">
                  <PRIcon state={pr.state} />
                  <div className="min-w-0">
                    <CardTitle className="text-base truncate">
                      {pr.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      #{pr.number} opened {formatRelativeTime(pr.createdAt)} by{" "}
                      {pr.author.login}
                    </CardDescription>
                  </div>
                </div>
                <PRBadge state={pr.state} />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={pr.author.avatarUrl} />
                    <AvatarFallback>
                      {pr.author.login[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{pr.author.login}</span>
                </div>
                <span>
                  {pr.head} → {pr.base}
                </span>
                <span className="text-green-500">+{pr.additions}</span>
                <span className="text-red-500">-{pr.deletions}</span>
                <span>{pr.changedFiles} files</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
