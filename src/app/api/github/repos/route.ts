import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { getUserRepos } from "@/lib/github/client";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const repos = await getUserRepos(session.user.id);

    // Transform and filter repos
    const transformedRepos = repos.map((repo) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      private: repo.private,
      url: repo.html_url,
      language: repo.language,
      stars: repo.stargazers_count,
      updatedAt: repo.updated_at,
      owner: {
        login: repo.owner.login,
        avatarUrl: repo.owner.avatar_url,
      },
    }));

    return NextResponse.json({ repos: transformedRepos });
  } catch (error) {
    console.error("Get repos error:", error);

    if (error instanceof Error && error.message.includes("access token")) {
      return NextResponse.json(
        { error: "GitHub authentication required. Please sign in again." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch repositories" },
      { status: 500 }
    );
  }
}
