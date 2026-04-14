"use client";

import { useEffect, useState, useCallback } from "react";
import type { TableOfContentsEntry } from "@/lib/content";

interface Props {
  entries: TableOfContentsEntry[];
}

export function TableOfContents({ entries }: Props) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        setActiveId(entry.target.id);
      }
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "-10% 0% -80% 0%",
      threshold: 0,
    });

    const sections = document.querySelectorAll("[data-section-id]");
    sections.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [handleObserver]);

  let currentPart = "";

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
        style={{
          background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-container))",
          color: "var(--color-on-primary)",
          boxShadow: "0px 12px 32px rgba(26, 28, 32, 0.08)",
        }}
        aria-label="Toggle table of contents"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 5h14M3 10h10M3 15h7" />
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav
        className={`
          fixed top-0 z-40 h-screen overflow-y-auto
          w-72 py-8 px-4
          bg-surface-container-low
          transition-transform duration-300 ease-in-out
          lg:sticky lg:translate-x-0 lg:shrink-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        aria-label="Table of contents"
      >
        <div className="mb-8 px-3">
          <p
            className="text-xs font-semibold uppercase tracking-widest text-secondary"
            style={{ fontFamily: "var(--font-label)" }}
          >
            Contents
          </p>
        </div>

        <ul className="space-y-0.5">
          {entries.map((entry) => {
            const showPart =
              entry.level === "section" || entry.level === "appendix";
            const partChanged = showPart && getPart(entry, entries) !== currentPart;
            if (partChanged) {
              currentPart = getPart(entry, entries);
            }

            return (
              <li key={entry.id}>
                {entry.level === "part" ? (
                  <div className="toc-part mt-2 first:mt-0">{entry.title}</div>
                ) : (
                  <>
                    <a
                      href={`#${entry.id}`}
                      className={`toc-link ${activeId === entry.id ? "active" : ""}${entry.wip ? " toc-wip" : ""}`}
                      onClick={() => setIsOpen(false)}
                    >
                      {entry.title}
                      {entry.wip && <span className="toc-wip-icon" title="Work in progress">🧰</span>}
                    </a>
                    {entry.children.length > 0 && activeId === entry.id && (
                      <ul className="space-y-0.5 mt-0.5">
                        {entry.children.map((child) => (
                          <li key={child.id}>
                            <a
                              href={`#${child.id}`}
                              className="toc-link toc-child"
                              onClick={() => setIsOpen(false)}
                            >
                              {child.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

function getPart(
  entry: TableOfContentsEntry,
  allEntries: TableOfContentsEntry[],
): string {
  const idx = allEntries.indexOf(entry);
  for (let i = idx - 1; i >= 0; i--) {
    if (allEntries[i].level === "part") return allEntries[i].title;
  }
  return "";
}
