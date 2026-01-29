"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { RepoList, Repo } from "@/components/github/repo-list";
import { Search } from "lucide-react";

export default function GitHubPage() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<Repo[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch("/api/github/repos");
        if (!response.ok) {
          throw new Error("Failed to fetch repositories");
        }
        const data = await response.json();
        setRepos(data.repos);
        setFilteredRepos(data.repos);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepos();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredRepos(repos);
      return;
    }

    const searchLower = search.toLowerCase();
    const filtered = repos.filter(
      (repo) =>
        repo.name.toLowerCase().includes(searchLower) ||
        repo.description?.toLowerCase().includes(searchLower) ||
        repo.language?.toLowerCase().includes(searchLower)
    );
    setFilteredRepos(filtered);
  }, [search, repos]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">GitHub Repositories</h1>
        <p className="text-muted-foreground mt-1">
          Select a repository to review its pull requests
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search repositories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {error ? (
        <div className="text-center text-destructive py-8">{error}</div>
      ) : (
        <RepoList repos={filteredRepos} isLoading={isLoading} />
      )}
    </div>
  );
}
