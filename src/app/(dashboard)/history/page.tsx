"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRelativeTime } from "@/lib/utils";
import { FileCode2, GitPullRequest, Trash2, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function HistoryPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchReviews = async (pageNum: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/reviews?page=${pageNum}&limit=10`);
      if (!response.ok) throw new Error("Failed to fetch reviews");
      const data = await response.json();
      setReviews(data.reviews);
      setPagination(data.pagination);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(page);
  }, [page]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await fetch(`/api/reviews?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete review");

      setReviews(reviews.filter((r) => r.id !== id));
      toast({
        title: "Deleted",
        description: "Review deleted successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Review History</h1>
        <p className="text-muted-foreground mt-1">
          View and manage your past code reviews
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <FileCode2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium">No reviews yet</p>
            <p className="text-muted-foreground">
              Start by reviewing some code!
            </p>
            <Link href="/review">
              <Button className="mt-4">Review Code</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {review.sourceType === "GITHUB_PR" ? (
                        <GitPullRequest className="h-5 w-5 text-primary mt-1" />
                      ) : (
                        <FileCode2 className="h-5 w-5 text-primary mt-1" />
                      )}
                      <div>
                        <CardTitle className="text-base">
                          {review.title}
                        </CardTitle>
                        <CardDescription>
                          {review.provider} / {review.model} •{" "}
                          {formatRelativeTime(review.createdAt)}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {review.sourceType === "GITHUB_PR" ? "PR" : "Paste"}
                      </Badge>
                      {review.language && (
                        <Badge variant="outline">{review.language}</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {review.sourceType === "GITHUB_PR" &&
                        review.repoOwner &&
                        review.repoName && (
                          <span>
                            {review.repoOwner}/{review.repoName} #
                            {review.prNumber}
                          </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/history/${review.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                      {review.sourceUrl && (
                        <a
                          href={review.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="ghost" size="icon">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </a>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(review.id)}
                        disabled={deletingId === review.id}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
