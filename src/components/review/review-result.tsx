"use client";

import { ReviewResult as ReviewResultType, ReviewIssue } from "@/lib/ai/providers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  Lightbulb,
  CheckCircle2,
  TrendingUp,
  Flame,
  Gavel,
  Quote,
  Skull,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewResultProps {
  result: ReviewResultType;
}

function getScoreColor(score: number): string {
  if (score >= 90) return "text-green-500";
  if (score >= 70) return "text-blue-500";
  if (score >= 50) return "text-yellow-500";
  if (score >= 30) return "text-orange-500";
  return "text-red-500";
}

function getScoreLabel(score: number): string {
  if (score >= 90) return "Suspiciously Good";
  if (score >= 70) return "Not Terrible";
  if (score >= 50) return "Needs Therapy";
  if (score >= 30) return "Code Crime";
  return "Call 911";
}

function getScoreEmoji(score: number): string {
  if (score >= 90) return "🤯";
  if (score >= 70) return "😏";
  if (score >= 50) return "😬";
  if (score >= 30) return "💀";
  return "🔥";
}

function IssueIcon({ type }: { type: ReviewIssue["type"] }) {
  switch (type) {
    case "error":
      return <Skull className="h-4 w-4 text-red-500" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case "suggestion":
      return <Lightbulb className="h-4 w-4 text-blue-500" />;
    case "info":
      return <Info className="h-4 w-4 text-muted-foreground" />;
  }
}

function IssueBadge({ type }: { type: ReviewIssue["type"] }) {
  const variants: Record<ReviewIssue["type"], "destructive" | "warning" | "default" | "secondary"> = {
    error: "destructive",
    warning: "warning",
    suggestion: "default",
    info: "secondary",
  };

  const labels: Record<ReviewIssue["type"], string> = {
    error: "Crime",
    warning: "Ouch",
    suggestion: "Pro Tip",
    info: "FYI",
  };

  return (
    <Badge variant={variants[type]}>
      {labels[type]}
    </Badge>
  );
}

export function ReviewResult({ result }: ReviewResultProps) {
  const errorCount = result.issues.filter((i) => i.type === "error").length;
  const warningCount = result.issues.filter((i) => i.type === "warning").length;
  const suggestionCount = result.issues.filter(
    (i) => i.type === "suggestion"
  ).length;

  return (
    <div className="space-y-6">
      {/* Score Card */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                Roast Score
              </CardTitle>
              <CardDescription>
                Roasted by {result.provider} / {result.model}
              </CardDescription>
            </div>
            <div className="text-center">
              <div className={cn("text-5xl font-bold", getScoreColor(result.score))}>
                {result.score}
                <span className="text-2xl ml-1">{getScoreEmoji(result.score)}</span>
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {getScoreLabel(result.score)}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg italic">&ldquo;{result.summary}&rdquo;</p>

          <div className="flex gap-4 text-sm flex-wrap">
            {errorCount > 0 && (
              <div className="flex items-center gap-1 text-red-500">
                <Skull className="h-4 w-4" />
                {errorCount} {errorCount === 1 ? "crime" : "crimes"}
              </div>
            )}
            {warningCount > 0 && (
              <div className="flex items-center gap-1 text-yellow-500">
                <AlertTriangle className="h-4 w-4" />
                {warningCount} {warningCount === 1 ? "ouch" : "ouches"}
              </div>
            )}
            {suggestionCount > 0 && (
              <div className="flex items-center gap-1 text-blue-500">
                <Lightbulb className="h-4 w-4" />
                {suggestionCount} pro {suggestionCount === 1 ? "tip" : "tips"}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Verdict */}
      {result.verdict && (
        <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Gavel className="h-6 w-6 text-red-500 mt-1" />
              <div>
                <p className="font-bold text-lg text-red-500">THE VERDICT</p>
                <p className="text-lg mt-1">{result.verdict}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Best Roasts */}
      {result.roasts && result.roasts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Best Burns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.roasts.map((roast, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-orange-500/5 rounded-lg border border-orange-500/20"
                >
                  <Quote className="h-4 w-4 text-orange-500 mt-1 shrink-0" />
                  <p className="italic">{roast}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Details Tabs */}
      <Tabs defaultValue="issues">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="issues">
            Issues ({result.issues.length})
          </TabsTrigger>
          <TabsTrigger value="improvements">
            Fix Your Life ({result.improvements.length})
          </TabsTrigger>
          <TabsTrigger value="positives">
            Pity Points ({result.positives.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="issues" className="space-y-4 mt-4">
          {result.issues.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <p className="text-lg">No issues found!</p>
                <p className="text-sm">Wait... that can&apos;t be right. Let me check again...</p>
              </CardContent>
            </Card>
          ) : (
            result.issues.map((issue, index) => (
              <Card key={index} className="border-l-4 border-l-orange-500">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <IssueIcon type={issue.type} />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <IssueBadge type={issue.type} />
                        <span className="font-medium">{issue.title}</span>
                        {issue.lineStart && (
                          <span className="text-xs text-muted-foreground">
                            Line {issue.lineStart}
                            {issue.lineEnd && issue.lineEnd !== issue.lineStart
                              ? `-${issue.lineEnd}`
                              : ""}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {issue.description}
                      </p>
                      {issue.suggestion && (
                        <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-md text-sm">
                          <span className="font-medium text-green-600">How to redeem yourself: </span>
                          {issue.suggestion}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="improvements" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {result.improvements.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  Honestly? Start over.
                </p>
              ) : (
                <ul className="space-y-3">
                  {result.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-500 mt-1" />
                      <span className="text-sm">{improvement}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positives" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {result.positives.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  I tried really hard to find something nice to say...
                </p>
              ) : (
                <ul className="space-y-3">
                  {result.positives.map((positive, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
                      <span className="text-sm">{positive}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
