export interface DiffHunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  content: string;
}

export interface ParsedDiff {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  hunks: DiffHunk[];
  fullPatch: string;
}

export function parsePatch(patch: string): DiffHunk[] {
  if (!patch) return [];

  const hunks: DiffHunk[] = [];
  const lines = patch.split("\n");
  let currentHunk: DiffHunk | null = null;
  let hunkContent: string[] = [];

  for (const line of lines) {
    const hunkHeader = line.match(/^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@/);

    if (hunkHeader) {
      // Save previous hunk
      if (currentHunk) {
        currentHunk.content = hunkContent.join("\n");
        hunks.push(currentHunk);
      }

      // Start new hunk
      currentHunk = {
        oldStart: parseInt(hunkHeader[1], 10),
        oldLines: parseInt(hunkHeader[2] || "1", 10),
        newStart: parseInt(hunkHeader[3], 10),
        newLines: parseInt(hunkHeader[4] || "1", 10),
        content: "",
      };
      hunkContent = [line];
    } else if (currentHunk) {
      hunkContent.push(line);
    }
  }

  // Save last hunk
  if (currentHunk) {
    currentHunk.content = hunkContent.join("\n");
    hunks.push(currentHunk);
  }

  return hunks;
}

export function formatDiffForReview(files: ParsedDiff[]): string {
  let output = "";

  for (const file of files) {
    output += `\n## File: ${file.filename}\n`;
    output += `Status: ${file.status} | +${file.additions} -${file.deletions}\n`;
    output += "```diff\n";
    output += file.fullPatch;
    output += "\n```\n";
  }

  return output;
}

export function extractAddedCode(patch: string): string {
  if (!patch) return "";

  const lines = patch.split("\n");
  const addedLines: string[] = [];

  for (const line of lines) {
    // Skip diff headers
    if (line.startsWith("@@")) continue;
    // Extract added lines (remove the + prefix)
    if (line.startsWith("+") && !line.startsWith("+++")) {
      addedLines.push(line.slice(1));
    }
  }

  return addedLines.join("\n");
}

export function extractChangedCode(patch: string): {
  added: string;
  removed: string;
  context: string;
} {
  if (!patch) return { added: "", removed: "", context: "" };

  const lines = patch.split("\n");
  const added: string[] = [];
  const removed: string[] = [];
  const context: string[] = [];

  for (const line of lines) {
    if (line.startsWith("@@")) continue;

    if (line.startsWith("+") && !line.startsWith("+++")) {
      added.push(line.slice(1));
    } else if (line.startsWith("-") && !line.startsWith("---")) {
      removed.push(line.slice(1));
    } else if (line.startsWith(" ")) {
      context.push(line.slice(1));
    }
  }

  return {
    added: added.join("\n"),
    removed: removed.join("\n"),
    context: context.join("\n"),
  };
}

export function combineFilesForReview(
  files: Array<{
    filename: string;
    patch?: string;
    status: string;
    additions: number;
    deletions: number;
  }>,
  maxLength: number = 50000
): string {
  let combined = "";
  let totalLength = 0;

  for (const file of files) {
    if (!file.patch) continue;

    const fileSection = `\n=== ${file.filename} (${file.status}: +${file.additions}/-${file.deletions}) ===\n${file.patch}\n`;

    if (totalLength + fileSection.length > maxLength) {
      combined += "\n... (additional files truncated due to length)\n";
      break;
    }

    combined += fileSection;
    totalLength += fileSection.length;
  }

  return combined;
}
