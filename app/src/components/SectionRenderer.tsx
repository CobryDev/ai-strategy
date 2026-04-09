import type { Section } from "@/lib/content";
import { getGitHubEditUrl } from "@/lib/content";
import { EditOnGitHub } from "./EditOnGitHub";

interface Props {
  section: Section;
  html: string;
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

  return (
    <article
      id={section.id}
      data-section-id={section.id}
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
        <EditOnGitHub url={editUrl} />
      </div>
    </article>
  );
}
