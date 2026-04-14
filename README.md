# The Enterprise Guide to AI Adoption

A Holloway-style digital book built with Next.js. Renders a per-section MDX content tree as a beautiful, linkable, highlightable reading experience.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

- **Content source**: `content/**/section.mdx` — one MDX file per section in the repo
- **Section parsing**: Content is discovered from frontmatter metadata and grouped into parts at build time
- **Callouts**: Custom remark/rehype plugin transforms `## 🚨 DANGER`, `## ⚠️ CAUTION`, `## ‼️ IMPORTANT`, `## 📜 STORY` patterns into styled callout components
- **Design system**: Based on "The Scholarly Architect" — Newsreader (display), Lexend (body), Plus Jakarta Sans (labels)

## Contributing

This guide is designed to be updated in small, frequent edits. Most contributions should happen in `content/**/section.mdx`.

1. Edit the relevant `content/**/section.mdx` file locally, or use the GitHub edit links from the app.
2. Run `npm run dev` to preview the change at `http://localhost:3000`.
3. Open a pull request with a short summary of what changed and why.

The revision badge in the navbar only counts commits that change section body content. Frontmatter and application code changes do not increase that number.

## How to commit

Commit messages are enforced with a Git hook. If the message does not match the rules below, the commit will fail.

### Use `content:` for content edits

If your commit changes any file under `content/`, the commit message must start with `content:`.

```bash
git commit -m "content: update governance checklist"
```

Content commits must only include files under `content/`. If you also changed app code, config, or docs, split that work into a separate commit.

### Use standard Conventional Commits for everything else

For non-content changes, use normal Conventional Commit types such as `feat:`, `fix:`, `docs:`, `refactor:`, or `chore:`.

```bash
git commit -m "feat: add filtered content history"
git commit -m "docs: update setup instructions"
git commit -m "fix: correct section anchor behavior"
```

### Rules the hook enforces

- Commits that edit files under `content/` must use the plain `content:` prefix.
- `content:` commits cannot include non-content files.
- Non-content commits must still follow Conventional Commits.
- `content(scope): ...` is rejected. Use `content: ...` instead.

## Configuration

Copy `.env.example` to `.env.local` and set your GitHub repo:

```
NEXT_PUBLIC_GITHUB_REPO=your-org/holloway-cobry
```

## Content Structure

The guide is organized into parts and sections:

- **Introduction** (Sections 1–3)
- **Part I: Foundations** (Sections 4–7)
- **Part II: Strategy** (Sections 8–11)
- **Part III: The Pillars** (Sections 12–17)
- **Part IV: Adoption** (Sections 18–21)
- **Part V: Domain-Specific Guidance** (Sections 22–28)
- **Part VI: The Hard Stuff** (Sections 29–32)
- **Appendices** (A–D)

## Content Authoring

Each numbered section lives in its own folder under `content/`, with:

- `section.mdx` for prose
- `components.tsx` for section-specific JSX you want to expose to that MDX file
