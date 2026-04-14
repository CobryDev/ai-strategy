import {
  parseContentIntoSections,
  getTableOfContents,
  getContentRevisionCount,
  getGitHubHistoryUrl,
  getRecentContentCommits,
} from "@/lib/content";
import { ReadingProgress } from "@/components/ReadingProgress";
import { TableOfContents } from "@/components/TableOfContents";
import { SectionRenderer } from "@/components/SectionRenderer";
import { SectionMdx } from "@/components/SectionMdx";
import { Header } from "@/components/Header";
import { SelectionBlameCard } from "@/components/SelectionBlameCard";
import { CitationTooltip } from "@/components/CitationTooltip";
import { CalloutLegend } from "@/components/CalloutLegend";
import { CLAIMS } from "@/lib/claims";
import { getSocialImageUrl, siteConfig } from "@/lib/site";

export default async function Home() {
  const sections = parseContentIntoSections();
  const toc = getTableOfContents();
  const revisionCount = getContentRevisionCount();
  const recentCommits = getRecentContentCommits(3);
  const historyUrl = getGitHubHistoryUrl();
  const contentSections = sections.filter((section) => section.level !== "part");
  const lastModified = contentSections.reduce(
    (latest, section) =>
      section.blame.lastModified > latest ? section.blame.lastModified : latest,
    new Date(0),
  );

  const title = siteConfig.title;
  const subtitle =
    "A comprehensive, actionable guide to building, governing, and scaling AI across your organization.";
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
      inLanguage: "en",
    },
    {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: siteConfig.title,
      description: siteConfig.description,
      url: siteConfig.url,
      mainEntityOfPage: siteConfig.url,
      inLanguage: "en",
      isAccessibleForFree: true,
      image: [getSocialImageUrl()],
      dateModified: lastModified.toISOString(),
      author: {
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
      },
      publisher: {
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
        logo: {
          "@type": "ImageObject",
          url: getSocialImageUrl(),
        },
      },
      articleSection: contentSections.map((section) =>
        section.number ? `${section.number}. ${section.title}` : section.title,
      ),
      about: siteConfig.keywords,
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <ReadingProgress />
      <Header
        revisionCount={revisionCount}
        recentCommits={recentCommits}
        historyUrl={historyUrl}
      />
      <SelectionBlameCard />
      <CitationTooltip claims={CLAIMS} />
      <CalloutLegend />

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
            {sections.map((section) => (
              <SectionRenderer
                key={section.id}
                section={section}
              >
                {section.level === "part" ? null : <SectionMdx section={section} />}
              </SectionRenderer>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
