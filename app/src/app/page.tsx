import { parseContentIntoSections, getTableOfContents } from "@/lib/content";
import { markdownToHtml } from "@/lib/markdown";
import { ReadingProgress } from "@/components/ReadingProgress";
import { TableOfContents } from "@/components/TableOfContents";
import { SectionRenderer } from "@/components/SectionRenderer";
import { Header } from "@/components/Header";

export default async function Home() {
  const sections = parseContentIntoSections();
  const toc = getTableOfContents();

  const sectionsWithHtml = await Promise.all(
    sections.map(async (section) => ({
      section,
      html: section.level === "part" ? "" : await markdownToHtml(section.content),
    })),
  );

  // Extract title and subtitle from first lines
  const title = "The Enterprise Guide to AI Adoption";
  const subtitle =
    "A comprehensive, actionable guide to building, governing, and scaling AI across your organization.";

  return (
    <>
      <ReadingProgress />
      <Header />

      <div className="flex min-h-screen">
        <TableOfContents entries={toc} />

        <main className="flex-1 min-w-0">
          {/* Hero */}
          <div className="bg-surface-container-lowest">
            <div className="max-w-3xl mx-auto px-6 sm:px-10 py-16 sm:py-24">
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--color-on-surface)",
                }}
              >
                {title}
              </h1>
              <p
                className="mt-6 text-lg sm:text-xl leading-relaxed"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                {subtitle}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <span
                  className="text-xs font-medium uppercase tracking-widest"
                  style={{
                    fontFamily: "var(--font-label)",
                    color: "var(--color-secondary)",
                  }}
                >
                  A living document — opinionated, practical, honest
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-3xl mx-auto px-6 sm:px-10 pb-24">
            {sectionsWithHtml.map(({ section, html }) => (
              <SectionRenderer
                key={section.id}
                section={section}
                html={html}
              />
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
