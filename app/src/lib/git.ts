import { execSync } from "child_process";
import { createHash } from "crypto";
import path from "path";

const ROOT_DIR = path.join(process.cwd(), "..");
const CONTENT_FILE = "content.md";

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

export function getRevisionCount(): number {
  try {
    const output = execSync(`git log --oneline -- ${CONTENT_FILE}`, {
      cwd: ROOT_DIR,
      encoding: "utf-8",
    });
    return output.trim().split("\n").filter(Boolean).length;
  } catch {
    return 1;
  }
}

export function getBlameData(): Map<number, LineBlameDatum> {
  const blameMap = new Map<number, LineBlameDatum>();

  try {
    const output = execSync(`git blame --porcelain -- ${CONTENT_FILE}`, {
      cwd: ROOT_DIR,
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024,
    });

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
    lastModified: new Date(latestTimestamp * 1000),
    contributors,
  };
}
