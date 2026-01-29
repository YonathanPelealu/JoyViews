import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { getRepoPRs } from "@/lib/github/client";
import { githubRepoSchema } from "@/lib/utils/validators";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const validationResult = githubRepoSchema.safeParse({
      owner: searchParams.get("owner"),
      repo: searchParams.get("repo"),
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Missing owner or repo parameter" },
        { status: 400 }
      );
    }

    const { owner, repo } = validationResult.data;
    const prs = await getRepoPRs(session.user.id, owner, repo);

    const transformedPRs = prs.map((pr) => ({
      id: pr.id,
      number: pr.number,
      title: pr.title,
      state: pr.state,
      url: pr.html_url,
      createdAt: pr.created_at,
      updatedAt: pr.updated_at,
      author: {
        login: pr.user.login,
        avatarUrl: pr.user.avatar_url,
      },
      head: pr.head.ref,
      base: pr.base.ref,
      additions: pr.additions,
      deletions: pr.deletions,
      changedFiles: pr.changed_files,
    }));

    return NextResponse.json({ pullRequests: transformedPRs });
  } catch (error) {
    console.error("Get PRs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch pull requests" },
      { status: 500 }
    );
  }
}
