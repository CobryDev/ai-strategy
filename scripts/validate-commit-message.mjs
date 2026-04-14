#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import fs from "node:fs";

const commitMessageFile = process.argv[2];

if (!commitMessageFile) {
  process.exit(0);
}

const commitMessage = fs.readFileSync(commitMessageFile, "utf8").trim();

if (
  /^(Merge|fixup!|squash!)/.test(commitMessage) ||
  /^revert:\s/i.test(commitMessage)
) {
  process.exit(0);
}

const typeMatch = commitMessage.match(/^([a-z]+)(?:\([^()\r\n]+\))?!?:\s.+$/);
const commitType = typeMatch?.[1] ?? null;
const isPlainContentCommit = /^content:\s.+$/.test(commitMessage);

function printError(lines) {
  console.error("");
  for (const line of lines) {
    console.error(line);
  }
  console.error("");
}

function formatFileList(files, limit = 8) {
  if (files.length <= limit) {
    return files.join(", ");
  }

  return `${files.slice(0, limit).join(", ")}, and ${files.length - limit} more`;
}

if (!commitType) {
  process.exit(0);
}

const stagedFiles = execFileSync(
  "git",
  ["diff", "--cached", "--name-only", "--diff-filter=ACMR"],
  { encoding: "utf8" },
)
  .split("\n")
  .map((file) => file.trim())
  .filter(Boolean);

const isContentFile = (filePath) => filePath.startsWith("content/");
const contentFiles = stagedFiles.filter(isContentFile);
const nonContentFiles = stagedFiles.filter((filePath) => !isContentFile(filePath));

if (contentFiles.length === 0) {
  if (commitType === "content") {
    printError([
      "Commit rejected: `content:` is only for commits that stage files under `content/`.",
      `Current message: ${commitMessage}`,
      "What to do next:",
      '- If this is a code or config change, use a normal type like `feat:`, `fix:`, `docs:`, or `refactor:`.',
      '- If this should be a content commit, stage at least one file from `content/` and try again.',
    ]);
    process.exit(1);
  }

  process.exit(0);
}

if (nonContentFiles.length > 0) {
  printError([
    "Commit rejected: `content:` commits must only include files from `content/`.",
    `Staged non-content files: ${formatFileList(nonContentFiles)}`,
    "What to do next:",
    "- Split this into two commits.",
    '- Commit content files with `content: your message`.',
    '- Commit the remaining files with a normal type like `feat:`, `fix:`, `docs:`, or `refactor:`.',
  ]);
  process.exit(1);
}

if (commitType !== "content") {
  printError([
    "Commit rejected: staged files under `content/` require the `content:` commit type.",
    `Current message: ${commitMessage}`,
    `Detected content files: ${formatFileList(contentFiles)}`,
    "Use this format instead:",
    "content: update governance section",
  ]);
  process.exit(1);
}

if (!isPlainContentCommit) {
  printError([
    "Commit rejected: content commits must use the plain `content:` prefix.",
    `Current message: ${commitMessage}`,
    "Allowed example:",
    "content: update governance section",
    "Not allowed:",
    "content(scope): update governance section",
    "content!: update governance section",
  ]);
  process.exit(1);
}
