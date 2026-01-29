import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { getProvider, isValidProvider, isValidModel } from "@/lib/ai/providers";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";
import { prisma } from "@/lib/db/prisma";
import { getPRDetails, getPRFiles } from "@/lib/github/client";
import { combineFilesForReview } from "@/lib/github/diff-parser";
import { z } from "zod";

const githubReviewSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  number: z.number().int().positive(),
  provider: z.enum(["openai", "anthropic"]).default("openai"),
  model: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const rateLimitResult = await checkRateLimit(`review:${session.user.id}`);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult),
        }
      );
    }

    const body = await request.json();
    const validationResult = githubReviewSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { owner, repo, number, provider, model } = validationResult.data;

    // Validate provider and model
    if (!isValidProvider(provider)) {
      return NextResponse.json(
        { error: `Invalid provider: ${provider}` },
        { status: 400 }
      );
    }

    if (!isValidModel(provider, model)) {
      return NextResponse.json(
        { error: `Invalid model for ${provider}: ${model}` },
        { status: 400 }
      );
    }

    // Fetch PR details and files
    const [prDetails, files] = await Promise.all([
      getPRDetails(session.user.id, owner, repo, number),
      getPRFiles(session.user.id, owner, repo, number),
    ]);

    const combinedDiff = combineFilesForReview(
      files.map((f) => ({
        filename: f.filename,
        status: f.status,
        additions: f.additions,
        deletions: f.deletions,
        patch: f.patch,
      }))
    );

    if (!combinedDiff.trim()) {
      return NextResponse.json(
        { error: "No reviewable changes found in this PR" },
        { status: 400 }
      );
    }

    // Get AI provider and perform review
    const aiProvider = getProvider(provider);
    const result = await aiProvider.review(
      {
        code: combinedDiff,
        context: `This is a GitHub Pull Request diff. PR Title: "${prDetails.title}". Changes: ${prDetails.additions} additions, ${prDetails.deletions} deletions across ${prDetails.changed_files} files.`,
      },
      model
    );

    // Save review to database
    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        title: `PR #${number}: ${prDetails.title}`,
        code: combinedDiff,
        provider,
        model,
        result: JSON.stringify(result),
        sourceType: "GITHUB_PR",
        sourceUrl: prDetails.html_url,
        prNumber: number,
        repoOwner: owner,
        repoName: repo,
      },
    });

    return NextResponse.json(
      {
        id: review.id,
        result,
        pr: {
          number: prDetails.number,
          title: prDetails.title,
          url: prDetails.html_url,
        },
      },
      { headers: getRateLimitHeaders(rateLimitResult) }
    );
  } catch (error) {
    console.error("GitHub review error:", error);

    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json(
          { error: "AI provider configuration error" },
          { status: 500 }
        );
      }
      if (error.message.includes("GitHub")) {
        return NextResponse.json(
          { error: "Failed to fetch PR from GitHub" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to process PR review" },
      { status: 500 }
    );
  }
}
