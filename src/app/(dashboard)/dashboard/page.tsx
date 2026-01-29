import Link from "next/link";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileCode2,
  GitPullRequest,
  History,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();

  const [recentReviews, reviewStats] = await Promise.all([
    prisma.review.findMany({
      where: { userId: session!.user!.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        provider: true,
        model: true,
        sourceType: true,
        createdAt: true,
      },
    }),
    prisma.review.groupBy({
      by: ["provider"],
      where: { userId: session!.user!.id },
      _count: true,
    }),
  ]);

  const totalReviews = reviewStats.reduce((acc, stat) => acc + stat._count, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {session?.user?.name?.split(" ")[0]}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening with your code reviews
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/review">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCode2 className="h-5 w-5 text-primary" />
                Review Code
              </CardTitle>
              <CardDescription>
                Paste code and get instant AI-powered review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Start Review
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/github">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitPullRequest className="h-5 w-5 text-primary" />
                GitHub PRs
              </CardTitle>
              <CardDescription>
                Review pull requests from your repositories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full">
                Browse Repos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/history">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Review History
              </CardTitle>
              <CardDescription>
                View and manage your past code reviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View History
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Reviews</CardDescription>
            <CardTitle className="text-3xl">{totalReviews}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              All time
            </p>
          </CardContent>
        </Card>

        {reviewStats.map((stat) => (
          <Card key={stat.provider}>
            <CardHeader className="pb-2">
              <CardDescription className="capitalize">
                {stat.provider} Reviews
              </CardDescription>
              <CardTitle className="text-3xl">{stat._count}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {Math.round((stat._count / totalReviews) * 100) || 0}% of total
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Reviews */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Reviews</CardTitle>
            <Link href="/history">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentReviews.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No reviews yet. Start by reviewing some code!
            </p>
          ) : (
            <div className="space-y-4">
              {recentReviews.map((review) => (
                <Link
                  key={review.id}
                  href={`/history/${review.id}`}
                  className="block"
                >
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      {review.sourceType === "GITHUB_PR" ? (
                        <GitPullRequest className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <FileCode2 className="h-4 w-4 text-muted-foreground" />
                      )}
                      <div>
                        <p className="font-medium text-sm">{review.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {review.provider} / {review.model}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {review.sourceType === "GITHUB_PR" ? "PR" : "Paste"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
