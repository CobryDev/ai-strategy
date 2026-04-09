# The Enterprise Guide to AI Adoption

A Holloway-style digital book built with Next.js. Renders `content.md` as a beautiful, linkable, highlightable reading experience.

## Quick Start

```bash
cd app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

- **Content source**: `../content.md` — single markdown file at the repo root
- **Section parsing**: Content is split into sections at build time by heading structure (`### N.` pattern)
- **Callouts**: Custom remark/rehype plugin transforms `## 🚨 DANGER`, `## ⚠️ CAUTION`, `## ‼️ IMPORTANT`, `## 📜 STORY` patterns into styled callout components
- **Design system**: Based on "The Scholarly Architect" — Newsreader (display), Lexend (body), Plus Jakarta Sans (labels)

## Contributing

1. Edit `content.md` directly — either locally or via the "Edit on GitHub" links on each section
2. Each section links to its exact line range in the source file
3. Contributors are tracked per-section via `git log`

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

## Splitting Content

The system is designed to work with a single `content.md` file. If you want to split into separate files later, update `src/lib/content.ts` to read from a `content/` directory instead.
