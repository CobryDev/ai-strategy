import fs from "fs";
import path from "path";
import {
  type SectionBlame,
  type BlameChunk,
  getBlameData,
  getBlameChunks,
  getRevisionCount,
  getSectionBlame,
} from "./git";
import { SECTION_QUESTIONS } from "./questions";

const WORDS_PER_MINUTE = 238;

export interface Section {
  id: string;
  number: string;
  title: string;
  part: string;
  content: string;
  startLine: number;
  endLine: number;
  level: "part" | "section" | "appendix";
  wip: boolean;
  readingTime: number;
  commonQuestions: string[];
  subsections: { id: string; title: string }[];
  blame: SectionBlame;
  blameChunks: BlameChunk[];
}

function wordCount(text: string): number {
  return text
    .replace(/[#*_`~\[\]()>|\\-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

export interface TableOfContentsEntry {
  id: string;
  title: string;
  level: "part" | "section" | "appendix";
  wip: boolean;
  children: { id: string; title: string }[];
}

const CONTENT_PATH = path.join(process.cwd(), "..", "content.md");

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .replace(/\\./g, "");
}

function extractSubsections(content: string): { id: string; title: string }[] {
  const subsections: { id: string; title: string }[] = [];
  const lines = content.split("\n");
  for (const line of lines) {
    const match = line.match(/^####\s+(\d+\.\d+)\s+(.+)/);
    if (match) {
      const title = match[2].trim();
      subsections.push({
        id: slugify(`${match[1]} ${title}`),
        title: `${match[1]} ${title}`,
      });
    }
  }
  return subsections;
}

export function getContent(): string {
  return fs.readFileSync(CONTENT_PATH, "utf-8");
}

export function parseContentIntoSections(): Section[] {
  const raw = getContent();
  const lines = raw.split("\n");
  const sections: Section[] = [];
  let currentPart = "INTRODUCTION";

  const sectionPattern = /^### (\d+)\\?\.\s+(.+)/;
  const partPattern = /^## (PART [IVX]+:.+)/;
  const introPattern = /^## (INTRODUCTION)/;
  const appendicesPattern = /^## (APPENDICES)/;
  const appendixPattern = /^### ([A-D])\\?\.\s+(.+)/;
  const designPattern = /^## (DESIGN PRINCIPLES.+)/;

  interface Marker {
    type: "part" | "section" | "appendix";
    number: string;
    title: string;
    part: string;
    line: number;
    wip: boolean;
  }
  const markers: Marker[] = [];

  function stripWip(title: string): { title: string; wip: boolean } {
    const wip = title.includes("🧰");
    return { title: title.replace(/\s*🧰\s*/g, " ").trim(), wip };
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const partMatch = line.match(partPattern);
    if (partMatch) {
      currentPart = partMatch[1];
      const { title: cleanTitle, wip } = stripWip(partMatch[1]);
      markers.push({
        type: "part",
        number: "",
        title: cleanTitle,
        part: currentPart,
        line: i,
        wip,
      });
      continue;
    }

    const introMatch = line.match(introPattern);
    if (introMatch) {
      currentPart = "INTRODUCTION";
      markers.push({
        type: "part",
        number: "",
        title: "Introduction",
        part: currentPart,
        line: i,
        wip: false,
      });
      continue;
    }

    const appendicesMatch = line.match(appendicesPattern);
    if (appendicesMatch) {
      currentPart = "APPENDICES";
      markers.push({
        type: "part",
        number: "",
        title: "Appendices",
        part: currentPart,
        line: i,
        wip: false,
      });
      continue;
    }

    const designMatch = line.match(designPattern);
    if (designMatch) {
      const { title: cleanTitle, wip } = stripWip(designMatch[1]);
      markers.push({
        type: "section",
        number: "",
        title: cleanTitle,
        part: currentPart,
        line: i,
        wip,
      });
      continue;
    }

    const sectionMatch = line.match(sectionPattern);
    if (sectionMatch) {
      const { title: cleanTitle, wip } = stripWip(sectionMatch[2].trim());
      markers.push({
        type: "section",
        number: sectionMatch[1],
        title: cleanTitle,
        part: currentPart,
        line: i,
        wip,
      });
      continue;
    }

    const appendixMatch = line.match(appendixPattern);
    if (appendixMatch) {
      const { title: cleanTitle, wip } = stripWip(appendixMatch[2].trim());
      markers.push({
        type: "appendix",
        number: appendixMatch[1],
        title: cleanTitle,
        part: currentPart,
        line: i,
        wip,
      });
      continue;
    }
  }

  const blameMap = getBlameData();

  for (let i = 0; i < markers.length; i++) {
    const marker = markers[i];
    const nextMarker = markers[i + 1];
    const startLine = marker.line;
    const endLine = nextMarker ? nextMarker.line - 1 : lines.length - 1;

    const sectionLines = lines.slice(startLine, endLine + 1);
    while (
      sectionLines.length > 0 &&
      (sectionLines[sectionLines.length - 1].trim() === "" ||
        sectionLines[sectionLines.length - 1].trim() === "---")
    ) {
      sectionLines.pop();
    }

    const content = sectionLines.join("\n");
    const id = marker.number
      ? slugify(`${marker.number} ${marker.title}`)
      : slugify(marker.title);

    const start1 = startLine + 1;
    const end1 = endLine + 1;

    const words = wordCount(content);
    const readingTime = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
    const commonQuestions = SECTION_QUESTIONS[marker.number] ?? [];

    sections.push({
      id,
      number: marker.number,
      title: marker.title,
      part: marker.part,
      content,
      startLine: start1,
      endLine: end1,
      level: marker.type,
      wip: marker.wip,
      readingTime,
      commonQuestions,
      subsections: extractSubsections(content),
      blame: getSectionBlame(blameMap, start1, end1),
      blameChunks: getBlameChunks(blameMap, start1, end1),
    });
  }

  return sections;
}

export function getTableOfContents(): TableOfContentsEntry[] {
  const sections = parseContentIntoSections();
  return sections.map((s) => ({
    id: s.id,
    title: s.number ? `${s.number}. ${s.title}` : s.title,
    level: s.level,
    wip: s.wip,
    children: s.subsections,
  }));
}

export function getGitHubEditUrl(
  startLine: number,
  endLine: number,
): string {
  const repo = process.env.NEXT_PUBLIC_GITHUB_REPO || "CobryDev/ai-strategy";
  return `https://github.com/${repo}/edit/main/content.md#L${startLine}-L${endLine}`;
}

export function getGitHubHistoryUrl(): string {
  const repo = process.env.NEXT_PUBLIC_GITHUB_REPO || "CobryDev/ai-strategy";
  return `https://github.com/${repo}/commits/main/content.md`;
}

export function getContentRevisionCount(): number {
  return getRevisionCount();
}
