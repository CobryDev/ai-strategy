
"use client";

import { useState, useRef, useEffect } from "react";

interface Props {
  revisionCount: number;
  recentCommits: {
    sha: string;
    shortSha: string;
    author: string;
    summary: string;
    committedAt: string;
  }[];
  historyUrl: string;
}

function formatCommitDate(committedAt: string): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(committedAt));
}

export function Header({ revisionCount, recentCommits, historyUrl }: Props) {
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setShowPopover(false);
      }
    }
    if (showPopover) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showPopover]);

  return (
    <header className="glass sticky top-0 z-30 py-3 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span
          className="text-sm font-semibold tracking-tight text-on-surface"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Enterprise AI Guide
        </span>
        <div className="relative hidden sm:inline">
          <button
            ref={triggerRef}
            onClick={() => setShowPopover(!showPopover)}
            className="text-xs text-secondary hover:text-on-surface transition-colors cursor-pointer underline decoration-dotted underline-offset-2"
          >
            by cobry
          </button>
          {showPopover && (
            <div
              ref={popoverRef}
              className="absolute top-full left-0 mt-2 w-72 p-3 rounded-lg border border-white/10 bg-surface-container shadow-lg text-xs text-secondary leading-relaxed z-50"
            >
              <p>
                <strong className="text-on-surface">Cobry</strong> are a cloud
                partner with experience across 400+ enterprise deployments,
                specialising in Google Workspace, GCP, and AI.
              </p>
              <p className="mt-2 text-secondary/70">
                This guide is vendor-agnostic despite Cobry&apos;s close
                allegiance with Google.
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="revision-popover-group relative">
          <a
            href={historyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="revision-badge"
            title={`${revisionCount} content change${revisionCount !== 1 ? "s" : ""} — view full history`}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Rev. {revisionCount}
          </a>
          <div className="revision-popover">
            <p className="revision-popover-label">
              Recent content changes
            </p>
            {recentCommits.length > 0 ? (
              <div className="revision-popover-list">
                {recentCommits.map((commit) => (
                  <div key={commit.sha} className="revision-popover-item">
                    <div className="revision-popover-summary-row">
                      <span className="revision-popover-sha">
                        {commit.shortSha}
                      </span>
                      <span className="revision-popover-date">
                        {formatCommitDate(commit.committedAt)}
                      </span>
                    </div>
                    <p className="revision-popover-summary">{commit.summary}</p>
                    <p className="revision-popover-author">{commit.author}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="revision-popover-empty">
                No content commits yet.
              </p>
            )}
            <a
              href={historyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="revision-popover-link"
            >
              See more on GitHub
            </a>
          </div>
        </div>
        <a
          href={historyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="edit-link"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
          Contributors
        </a>
      </div>
    </header>
  );
}
