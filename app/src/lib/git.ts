import { execSync } from "child_process";
import path from "path";

const ROOT_DIR = path.join(process.cwd(), "..");
const CONTENT_FILE = "content.md";

export interface LineBlameDatum {
  author: string;
  timestamp: number;
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
    let currentAuthor = "";
    let currentTimestamp = 0;

    for (const line of lines) {
      const headerMatch = line.match(
        /^[0-9a-f]{40}\s+(\d+)\s+(\d+)(?:\s+(\d+))?$/,
      );
      if (headerMatch) {
        currentLine = parseInt(headerMatch[2], 10);
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
          timestamp: currentTimestamp,
        });
      }
    }
  } catch {
    // Outside a git repo or no commits — return empty map
  }

  return blameMap;
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
