import { execSync } from "child_process";
import path from "path";

const ROOT_DIR = path.join(process.cwd(), "..");
const CONTENT_FILE = "content.md";

export interface LineBlameDatum {
  author: string;
  sha: string;
  timestamp: number;
}

export interface BlameChunk {
  s: number; // startLine (1-indexed)
  e: number; // endLine (1-indexed)
  a: string; // author
  c: string; // commit SHA (short)
  t: number; // unix timestamp
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
    let currentLine = 0;
    let currentSha = "";
    let currentAuthor = "";
    let currentTimestamp = 0;

    for (const line of lines) {
      const headerMatch = line.match(
        /^([0-9a-f]{40})\s+(\d+)\s+(\d+)(?:\s+(\d+))?$/,
      );
      if (headerMatch) {
        currentSha = headerMatch[1];
        currentLine = parseInt(headerMatch[3], 10);
        continue;
      }

      if (line.startsWith("author ")) {
        currentAuthor = line.slice(7);
        continue;
      }

      if (line.startsWith("author-time ")) {
        currentTimestamp = parseInt(line.slice(12), 10);
        continue;
      }

      if (line.startsWith("\t")) {
        blameMap.set(currentLine, {
          author: currentAuthor,
          sha: currentSha,
          timestamp: currentTimestamp,
        });
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
