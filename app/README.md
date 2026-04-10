# The Enterprise Guide to AI Adoption

A Holloway-style digital book built with Next.js. Renders a per-section MDX content tree as a beautiful, linkable, highlightable reading experience.

## Quick Start

```bash
cd app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

- **Content source**: `content/**/section.mdx` — one MDX file per section inside the app
- **Section parsing**: Content is discovered from frontmatter metadata and grouped into parts at build time
- **Callouts**: Custom remark/rehype plugin transforms `## 🚨 DANGER`, `## ⚠️ CAUTION`, `## ‼️ IMPORTANT`, `## 📜 STORY` patterns into styled callout components
- **Design system**: Based on "The Scholarly Architect" — Newsreader (display), Lexend (body), Plus Jakarta Sans (labels)

## Contributing

1. Edit the relevant `content/**/section.mdx` file directly — either locally or via the "Edit on GitHub" links on each section
2. Each section links to its source MDX file in GitHub
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

## Content Authoring

Each numbered section lives in its own folder under `content/`, with:

- `section.mdx` for prose
- `components.tsx` for section-specific JSX you want to expose to that MDX file
