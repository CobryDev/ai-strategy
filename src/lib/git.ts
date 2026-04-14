import { execSync } from "child_process";
import { createHash } from "crypto";

const ROOT_DIR = process.cwd();
const CONTENT_ROOT = "content";
const GIT_MAX_BUFFER = 10 * 1024 * 1024;

export interface LineBlameDatum {
  author: string;
  sha: string;
  timestamp: number;
  email: string;
  summary: string;
}

export interface BlameChunk {
  s: number; // startLine (1-indexed)
  e: number; // endLine (1-indexed)
  a: string; // author
  c: string; // commit SHA (short)
  t: number; // unix timestamp
  m: string; // commit message (first line)
  av: string; // avatar URL (Gravatar)
}

export interface RecentCommit {
  sha: string;
  shortSha: string;
  author: string;
  summary: string;
  timestamp: number;
}

export interface CommitPathChange {
  status: string;
  previousPath: string | null;
  currentPath: string | null;
}

function gravatarUrl(email: string): string {
  const hash = createHash("md5")
    .update(email.trim().toLowerCase())
    .digest("hex");
  return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=48`;
}

export interface SectionBlame {
  primaryAuthor: string;
  lastModified: Date;
  contributors: { name: string; lines: number }[];
}

function normalizePath(targetPath: string): string {
  const trimmed = targetPath.trim();
  return trimmed.length > 0 ? trimmed : CONTENT_ROOT;
}

function quoteShellArg(value: string): string {
  return JSON.stringify(value);
}

function runGit(command: string): string {
  return execSync(command, {
    cwd: ROOT_DIR,
    encoding: "utf-8",
    maxBuffer: GIT_MAX_BUFFER,
  });
}

function parseRecentCommitRecords(output: string): RecentCommit[] {
  return output
    .split("\x1e")
    .map((record) => record.trim())
    .filter(Boolean)
    .map((record) => {
      const [sha, author, timestamp, summary] = record.split("\x1f");

      return {
        sha,
        shortSha: sha.slice(0, 7),
        author,
        summary,
        timestamp: Number(timestamp),
      };
    });
}

export function getAllCommits(targetPath = CONTENT_ROOT): RecentCommit[] {
  try {
    const output = runGit(
      `git log --pretty=format:%H%x1f%an%x1f%at%x1f%s%x1e -- ${quoteShellArg(normalizePath(targetPath))} 2>/dev/null`,
    );

    return parseRecentCommitRecords(output);
  } catch {
    return [];
  }
}

export function getRevisionCount(targetPath = CONTENT_ROOT): number {
  try {
    const output = runGit(
      `git log --oneline -- ${quoteShellArg(normalizePath(targetPath))} 2>/dev/null`,
    );
    return output.trim().split("\n").filter(Boolean).length;
  } catch {
    return 1;
  }
}

export function getRecentCommits(
  targetPath = CONTENT_ROOT,
  limit = 3,
): RecentCommit[] {
  try {
    const output = runGit(
      `git log -n ${limit} --pretty=format:%H%x1f%an%x1f%at%x1f%s%x1e -- ${quoteShellArg(normalizePath(targetPath))} 2>/dev/null`,
    );

    return parseRecentCommitRecords(output);
  } catch {
    return [];
  }
}

export function getFirstParentSha(sha: string): string | null {
  try {
    const output = runGit(
      `git rev-list --parents -n 1 ${quoteShellArg(sha)} 2>/dev/null`,
    ).trim();
    const [, firstParent] = output.split(" ");
    return firstParent || null;
  } catch {
    return null;
  }
}

export function getChangedPaths(
  currentRevision: string,
  previousRevision: string | null,
  targetPath = CONTENT_ROOT,
): CommitPathChange[] {
  try {
    const output = previousRevision
      ? runGit(
          `git diff --name-status --find-renames ${quoteShellArg(previousRevision)} ${quoteShellArg(currentRevision)} -- ${quoteShellArg(normalizePath(targetPath))} 2>/dev/null`,
        )
      : runGit(
          `git diff-tree --root --find-renames --no-commit-id --name-status -r ${quoteShellArg(currentRevision)} -- ${quoteShellArg(normalizePath(targetPath))} 2>/dev/null`,
        );

    return output
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [status, ...paths] = line.split("\t");

        if (status.startsWith("R") || status.startsWith("C")) {
          const [previousPath, currentPath] = paths;
          return {
            status,
            previousPath: previousPath || null,
            currentPath: currentPath || null,
          };
        }

        const [path] = paths;
        const normalizedPath = path || null;

        return {
          status,
          previousPath: status.startsWith("A") ? null : normalizedPath,
          currentPath: status.startsWith("D") ? null : normalizedPath,
        };
      });
  } catch {
    return [];
  }
}

export function readFileAtRevision(
  revision: string,
  targetPath: string,
): string | null {
  try {
    return runGit(
      `git show ${quoteShellArg(`${revision}:${targetPath}`)} 2>/dev/null`,
    );
  } catch {
    return null;
  }
}

export function getBlameData(targetPath: string): Map<number, LineBlameDatum> {
  const blameMap = new Map<number, LineBlameDatum>();

  try {
    const output = runGit(
      `git blame --porcelain -- ${quoteShellArg(normalizePath(targetPath))} 2>/dev/null`,
    );

    const lines = output.split("\n");

    interface CommitInfo {
      author: string;
      email: string;
      timestamp: number;
      summary: string;
    }

    const commitCache = new Map<string, CommitInfo>();
    let currentSha = "";
    let currentLine = 0;
    let pending: Partial<CommitInfo> = {};

    for (const line of lines) {
      const headerMatch = line.match(
        /^([0-9a-f]{40})\s+(\d+)\s+(\d+)(?:\s+(\d+))?$/,
      );
      if (headerMatch) {
        currentSha = headerMatch[1];
        currentLine = parseInt(headerMatch[3], 10);
        if (!commitCache.has(currentSha)) {
          pending = {};
        }
        continue;
      }

      if (line.startsWith("author ")) {
        pending.author = line.slice(7);
        continue;
      }

      if (line.startsWith("author-mail ")) {
        pending.email = line.slice(12).replace(/[<>]/g, "");
        continue;
      }

      if (line.startsWith("author-time ")) {
        pending.timestamp = parseInt(line.slice(12), 10);
        continue;
      }

      if (line.startsWith("summary ")) {
        pending.summary = line.slice(8);
        continue;
      }

      if (line.startsWith("\t")) {
        if (!commitCache.has(currentSha) && pending.author) {
          commitCache.set(currentSha, {
            author: pending.author,
            email: pending.email || "",
            timestamp: pending.timestamp || 0,
            summary: pending.summary || "",
          });
        }

        const info = commitCache.get(currentSha);
        if (info) {
          blameMap.set(currentLine, {
            author: info.author,
            sha: currentSha,
            timestamp: info.timestamp,
            email: info.email,
            summary: info.summary,
          });
        }
      }
    }
  } catch {
    // Outside a git repo or no commits — return empty map
  }

  return blameMap;
}

export function getBlameChunks(
  blameMap: Map<number, LineBlameDatum>,
  startLine: number,
  endLine: number,
): BlameChunk[] {
  const chunks: BlameChunk[] = [];
  let current: BlameChunk | null = null;

  for (let line = startLine; line <= endLine; line++) {
    const datum = blameMap.get(line);
    if (!datum) continue;

    if (current && current.c === datum.sha.slice(0, 7)) {
      current.e = line;
    } else {
      current = {
        s: line,
        e: line,
        a: datum.author,
        c: datum.sha.slice(0, 7),
        t: datum.timestamp,
        m: datum.summary,
        av: datum.email ? gravatarUrl(datum.email) : "",
      };
      chunks.push(current);
    }
  }

  return chunks;
}

export function getSectionBlame(
  blameMap: Map<number, LineBlameDatum>,
  startLine: number,
  endLine: number,
): SectionBlame {
  const authorLineCounts = new Map<string, number>();
  let latestTimestamp = 0;

  for (let line = startLine; line <= endLine; line++) {
    const datum = blameMap.get(line);
    if (!datum) continue;

    authorLineCounts.set(
      datum.author,
      (authorLineCounts.get(datum.author) || 0) + 1,
    );

    if (datum.timestamp > latestTimestamp) {
      latestTimestamp = datum.timestamp;
    }
  }

  const contributors = Array.from(authorLineCounts.entries())
    .map(([name, lines]) => ({ name, lines }))
    .sort((a, b) => b.lines - a.lines);

  return {
    primaryAuthor: contributors[0]?.name || "Unknown",
    lastModified:
      latestTimestamp > 0 ? new Date(latestTimestamp * 1000) : new Date(0),
    contributors,
  };
}
