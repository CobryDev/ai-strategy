import type { ReactNode } from "react";
import type { Section } from "@/lib/content";
import { getGitHubEditUrl } from "@/lib/content";
import { EditOnGitHub } from "./EditOnGitHub";

interface Props {
  section: Section;
  children?: ReactNode;
}

const DATE_FORMATTER = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function SectionRenderer({ section, children }: Props) {
  if (section.level === "part") {
    return (
      <div
        id={section.id}
        data-section-id={section.id}
        className="part-header"
      >
        {section.title}
      </div>
    );
  }

  const editUrl = getGitHubEditUrl(section.sourcePath);
  const { blame } = section;
  const contributorNames = blame.contributors.map((contributor) => contributor.name);
  const hasContributors = contributorNames.length > 0;
  const formattedLastModified =
    blame.lastModified.getTime() > 0
      ? DATE_FORMATTER.format(blame.lastModified)
      : "Unknown";

  const { readingTime, commonQuestions } = section;
  const showPreamble = readingTime > 0 || commonQuestions.length > 0;

  return (
    <article
      id={section.id}
      data-section-id={section.id}
      data-blame-author={blame.primaryAuthor}
      data-blame-date={blame.lastModified.toISOString()}
      data-blame-contributors={blame.contributors.length}
      data-blame-chunks={JSON.stringify(section.blameChunks)}
      className={`section-container${section.wip ? " section-wip" : ""}`}
    >
      {section.wip && (
        <div className="wip-badge">
          <span className="wip-badge-icon">🧰</span>
          Work in progress
        </div>
      )}
      {showPreamble && (
        <div className="chapter-preamble">
          <span className="reading-time-badge">
            <span className="reading-time-icon" aria-hidden="true">◷</span>
            {readingTime} min read
          </span>
          {commonQuestions.length > 0 && (
            <div className="common-questions">
              <div className="common-questions-label">
                Questions this section answers
              </div>
              <ul>
                {commonQuestions.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      <div className="prose">{children}</div>
      <div className="section-meta">
        <div className="section-attribution">
          <span className="section-meta-label">Contributors</span>
          <span className="section-blame">
            {hasContributors ? contributorNames.join(", ") : "Unknown"}
          </span>
        </div>
        <div className="section-attribution">
          <span className="section-meta-label">Last edited</span>
          <time
            className="section-last-edited"
            dateTime={
              blame.lastModified.getTime() > 0
                ? blame.lastModified.toISOString()
                : undefined
            }
          >
            {formattedLastModified}
          </time>
        </div>
        <EditOnGitHub url={editUrl} />
      </div>
    </article>
  );
}
