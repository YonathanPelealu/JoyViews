import { prisma } from "@/lib/db/prisma";

const GITHUB_API_BASE = "https://api.github.com";

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface GithubPR {
  id: number;
  number: number;
  title: string;
  state: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  user: {
    login: string;
    avatar_url: string;
  };
  head: {
    ref: string;
    sha: string;
  };
  base: {
    ref: string;
  };
  additions: number;
  deletions: number;
  changed_files: number;
}

export interface GithubFile {
  sha: string;
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  changes: number;
  patch?: string;
  contents_url: string;
}

async function getGithubToken(userId: string): Promise<string | null> {
  const account = await prisma.account.findFirst({
    where: {
      userId,
      provider: "github",
    },
    select: {
      access_token: true,
    },
  });

  return account?.access_token || null;
}

async function githubFetch<T>(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GitHub API error: ${response.status} - ${error}`);
  }

  return response.json();
}

export async function getUserRepos(userId: string): Promise<GithubRepo[]> {
  const token = await getGithubToken(userId);
  if (!token) {
    throw new Error("GitHub access token not found");
  }

  return githubFetch<GithubRepo[]>(
    "/user/repos?sort=updated&per_page=100",
    token
  );
}

export async function getRepoPRs(
  userId: string,
  owner: string,
  repo: string
): Promise<GithubPR[]> {
  const token = await getGithubToken(userId);
  if (!token) {
    throw new Error("GitHub access token not found");
  }

  return githubFetch<GithubPR[]>(
    `/repos/${owner}/${repo}/pulls?state=all&sort=updated&per_page=30`,
    token
  );
}

export async function getPRDetails(
  userId: string,
  owner: string,
  repo: string,
  number: number
): Promise<GithubPR> {
  const token = await getGithubToken(userId);
  if (!token) {
    throw new Error("GitHub access token not found");
  }

  return githubFetch<GithubPR>(
    `/repos/${owner}/${repo}/pulls/${number}`,
    token
  );
}

export async function getPRFiles(
  userId: string,
  owner: string,
  repo: string,
  number: number
): Promise<GithubFile[]> {
  const token = await getGithubToken(userId);
  if (!token) {
    throw new Error("GitHub access token not found");
  }

  return githubFetch<GithubFile[]>(
    `/repos/${owner}/${repo}/pulls/${number}/files`,
    token
  );
}

export async function getFileContent(
  userId: string,
  owner: string,
  repo: string,
  path: string,
  ref: string
): Promise<string> {
  const token = await getGithubToken(userId);
  if (!token) {
    throw new Error("GitHub access token not found");
  }

  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}?ref=${ref}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3.raw",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch file content: ${response.status}`);
  }

  return response.text();
}
