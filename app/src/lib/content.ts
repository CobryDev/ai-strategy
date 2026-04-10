import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { globSync } from "glob";
import {
  type BlameChunk,
  type SectionBlame,
  getBlameChunks,
  getBlameData,
  getRevisionCount,
  getSectionBlame,
} from "./git";
import { SECTION_QUESTIONS } from "./questions";

const WORDS_PER_MINUTE = 238;
const CONTENT_DIR = path.join(process.cwd(), "content");
const REPO_ROOT = path.join(process.cwd(), "..");

type SectionLevel = "part" | "section" | "appendix";

interface SectionFrontmatter {
  order: number;
  number?: string;
  title: string;
  partId: string;
  partTitle: string;
  level?: Exclude<SectionLevel, "part">;
  wip?: boolean;
}

export interface Section {
  id: string;
  number: string;
  title: string;
  part: string;
  partId: string;
  content: string;
  sourcePath: string;
  sourceLineOffset: number;
  startLine: number;
  endLine: number;
  level: SectionLevel;
  wip: boolean;
  readingTime: number;
  commonQuestions: string[];
  subsections: { id: string; title: string }[];
  blame: SectionBlame;
  blameChunks: BlameChunk[];
}

export interface TableOfContentsEntry {
  id: string;
  title: string;
  level: "part" | "section" | "appendix";
  wip: boolean;
  children: { id: string; title: string }[];
}

interface ContentRecord {
  order: number;
  section: Section;
}

function wordCount(text: string): number {
  return text
    .replace(/[#*_`~\[\]()>|\\-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

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

  for (const line of content.split("\n")) {
    const match = line.match(/^##\s+(\d+\.\d+)\s+(.+)/);
    if (!match) continue;

    const title = match[2].trim();
    subsections.push({
      id: slugify(`${match[1]} ${title}`),
      title: `${match[1]} ${title}`,
    });
  }

  return subsections;
}

function getSourceLineOffset(raw: string): number {
  const lines = raw.split("\n");

  if (lines[0] !== "---") {
    return 0;
  }

  let index = 1;
  while (index < lines.length && lines[index] !== "---") {
    index += 1;
  }

  index += 1;

  while (index < lines.length && lines[index].trim() === "") {
    index += 1;
  }

  return index;
}

function toRepoRelativePath(filePath: string): string {
  return path.relative(REPO_ROOT, filePath).split(path.sep).join("/");
}

function createPartSection(partId: string, partTitle: string): Section {
  return {
    id: partId,
    number: "",
    title: partTitle,
    part: partTitle,
    partId,
    content: "",
    sourcePath: "",
    sourceLineOffset: 0,
    startLine: 0,
    endLine: 0,
    level: "part",
    wip: false,
    readingTime: 0,
    commonQuestions: [],
    subsections: [],
    blame: {
      primaryAuthor: "Unknown",
      lastModified: new Date(0),
      contributors: [],
    },
    blameChunks: [],
  };
}

function readContentRecords(): ContentRecord[] {
  const files = globSync("**/section.mdx", {
    cwd: CONTENT_DIR,
    absolute: true,
    posix: true,
  });

  return files
    .map((filePath) => {
      const raw = fs.readFileSync(filePath, "utf-8");
      const parsed = matter(raw);
      const frontmatter = parsed.data as Partial<SectionFrontmatter>;
      const content = parsed.content.replace(/^\n+/, "");
      const sourcePath = toRepoRelativePath(filePath);
      const blameMap = getBlameData(sourcePath);
      const totalLines = raw.split("\n").length;
      const sourceLineOffset = getSourceLineOffset(raw);
      const number = String(frontmatter.number ?? "");
      const title = String(frontmatter.title ?? "");
      const partId = String(frontmatter.partId ?? "");
      const partTitle = String(frontmatter.partTitle ?? "");
      const level: Exclude<SectionLevel, "part"> =
        frontmatter.level === "appendix" ? "appendix" : "section";
      const words = wordCount(content);
      const readingTime = Math.max(1, Math.round(words / WORDS_PER_MINUTE));

      if (!title || !partId || !partTitle) {
        throw new Error(`Invalid frontmatter in ${sourcePath}`);
      }

      return {
        order: Number(frontmatter.order ?? 0),
        section: {
          id: number ? slugify(`${number} ${title}`) : slugify(title),
          number,
          title,
          part: partTitle,
          partId,
          content,
          sourcePath,
          sourceLineOffset,
          startLine: 1,
          endLine: totalLines,
          level,
          wip: Boolean(frontmatter.wip),
          readingTime,
          commonQuestions: SECTION_QUESTIONS[number] ?? [],
          subsections: extractSubsections(content),
          blame: getSectionBlame(blameMap, 1, totalLines),
          blameChunks: getBlameChunks(blameMap, 1, totalLines),
        },
      };
    })
    .sort(
      (left, right) =>
        left.order - right.order ||
        left.section.sourcePath.localeCompare(right.section.sourcePath),
    );
}

export function parseContentIntoSections(): Section[] {
  const orderedSections = readContentRecords();
  const sections: Section[] = [];
  let currentPartId = "";

  for (const { section } of orderedSections) {
    if (section.partId !== currentPartId) {
      sections.push(createPartSection(section.partId, section.part));
      currentPartId = section.partId;
    }

    sections.push(section);
  }

  return sections;
}

export function getTableOfContents(): TableOfContentsEntry[] {
  return parseContentIntoSections().map((section) => ({
    id: section.id,
    title: section.number ? `${section.number}. ${section.title}` : section.title,
    level: section.level,
    wip: section.wip,
    children: section.subsections,
  }));
}

export function getGitHubEditUrl(sourcePath: string): string {
  const repo = process.env.NEXT_PUBLIC_GITHUB_REPO || "CobryDev/ai-strategy";
  return `https://github.com/${repo}/edit/main/${sourcePath}`;
}

export function getGitHubHistoryUrl(): string {
  const repo = process.env.NEXT_PUBLIC_GITHUB_REPO || "CobryDev/ai-strategy";
  return `https://github.com/${repo}/commits/main/app/content`;
}

export function getContentRevisionCount(): number {
  return getRevisionCount("app/content");
}
