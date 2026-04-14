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
    console.error(
      "Invalid commit message: `content:` is reserved for commits that only edit files under `content/`.",
    );
    process.exit(1);
  }

  process.exit(0);
}

if (nonContentFiles.length > 0) {
  console.error(
    "Content commits must be isolated. Commit changes under `content/` separately from other files.",
  );
  console.error(`Mixed files: ${nonContentFiles.join(", ")}`);
  process.exit(1);
}

if (commitType !== "content") {
  console.error(
    "Commits that edit files under `content/` must use the Conventional Commit type `content:`.",
  );
  console.error("Example: content: update governance section");
  process.exit(1);
}

if (!isPlainContentCommit) {
  console.error(
    "Content commits must use the plain `content:` prefix without a scope or breaking-change marker.",
  );
  console.error("Example: content: update governance section");
  process.exit(1);
}
