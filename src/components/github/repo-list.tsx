"use client";

import Link from "next/link";
import { Star, Lock, Globe } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRelativeTime } from "@/lib/utils";

export interface Repo {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  private: boolean;
  url: string;
  language: string | null;
  stars: number;
  updatedAt: string;
  owner: {
    login: string;
    avatarUrl: string;
  };
}

interface RepoListProps {
  repos: Repo[];
  isLoading?: boolean;
}

function RepoSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

export function RepoList({ repos, isLoading }: RepoListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <RepoSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (repos.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          No repositories found
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {repos.map((repo) => (
        <Link key={repo.id} href={`/github/${repo.owner.login}/${repo.name}`}>
          <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base truncate">{repo.name}</CardTitle>
                {repo.private ? (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Globe className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <CardDescription className="line-clamp-2">
                {repo.description || "No description"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {repo.language && (
                  <Badge variant="secondary">{repo.language}</Badge>
                )}
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {repo.stars}
                </div>
                <span>{formatRelativeTime(repo.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
