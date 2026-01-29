import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { getPRDetails, getPRFiles } from "@/lib/github/client";
import { combineFilesForReview } from "@/lib/github/diff-parser";
import { githubPrSchema } from "@/lib/utils/validators";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const validationResult = githubPrSchema.safeParse({
      owner: searchParams.get("owner"),
      repo: searchParams.get("repo"),
      number: searchParams.get("number"),
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Missing or invalid parameters" },
        { status: 400 }
      );
    }

    const { owner, repo, number } = validationResult.data;

    const [prDetails, files] = await Promise.all([
      getPRDetails(session.user.id, owner, repo, number),
      getPRFiles(session.user.id, owner, repo, number),
    ]);

    const transformedFiles = files.map((file) => ({
      filename: file.filename,
      status: file.status,
      additions: file.additions,
      deletions: file.deletions,
      changes: file.changes,
      patch: file.patch,
    }));

    const combinedDiff = combineFilesForReview(transformedFiles);

    return NextResponse.json({
      pr: {
        number: prDetails.number,
        title: prDetails.title,
        state: prDetails.state,
        url: prDetails.html_url,
        author: {
          login: prDetails.user.login,
          avatarUrl: prDetails.user.avatar_url,
        },
        head: prDetails.head.ref,
        base: prDetails.base.ref,
        additions: prDetails.additions,
        deletions: prDetails.deletions,
        changedFiles: prDetails.changed_files,
      },
      files: transformedFiles,
      combinedDiff,
    });
  } catch (error) {
    console.error("Get PR diff error:", error);
    return NextResponse.json(
      { error: "Failed to fetch PR diff" },
      { status: 500 }
    );
  }
}
