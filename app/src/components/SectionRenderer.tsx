import type { Section } from "@/lib/content";
import { getGitHubEditUrl } from "@/lib/content";
import { EditOnGitHub } from "./EditOnGitHub";

interface Props {
  section: Section;
  html: string;
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(days / 365);
  return `${years}y ago`;
}

export function SectionRenderer({ section, html }: Props) {
  const editUrl = getGitHubEditUrl(section.startLine, section.endLine);

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

  const { blame } = section;
  const otherContributors = blame.contributors.length - 1;

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
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <div className="section-meta">
        <span className="section-blame">
          {blame.primaryAuthor}
          {otherContributors > 0 && (
            <span className="section-blame-extra">
              {" "}+{otherContributors}
            </span>
          )}
          <span className="section-blame-sep" aria-hidden="true">·</span>
          <time dateTime={blame.lastModified.toISOString()}>
            {timeAgo(blame.lastModified)}
          </time>
        </span>
        <EditOnGitHub url={editUrl} />
      </div>
    </article>
  );
}
