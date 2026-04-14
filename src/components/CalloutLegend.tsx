"use client";

import { useEffect, useState } from "react";

const LEGEND_ITEMS = [
  {
    type: "important",
    icon: "◇",
    label: "Important",
    desc: "Important or often overlooked tip",
  },
  {
    type: "danger",
    icon: "⚠",
    label: "Danger",
    desc: "Serious warning or pitfall where risks or costs are significant",
  },
  {
    type: "caution",
    icon: "◇",
    label: "Caution",
    desc: "Caution, limitation, or problem",
  },
  {
    type: "controversy",
    icon: "📣",
    label: "Controversy",
    desc: "Controversial topic where informed opinion varies significantly",
  },
  {
    type: "confusion",
    icon: "🤷",
    label: "Confusion",
    desc: "Common confusion or misunderstanding, such as confusing terminology",
  },
  {
    type: "new",
    icon: "🆕",
    label: "New",
    desc: "New or recent developments",
  },
  {
    type: "contribute",
    icon: "✏️",
    label: "Contribute",
    desc: "Reader contribution solicited",
  },
  {
    type: "story",
    icon: "💬",
    label: "Story",
    desc: "A personal anecdote or story",
  },
] as const;

export function CalloutLegend() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        className="callout-legend-trigger"
        onClick={() => setIsOpen(true)}
        aria-label="Open legend"
      >
        ?
      </button>

      {isOpen && (
        <div
          className="callout-legend-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <div
            className="callout-legend-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="callout-legend-title"
          >
            <button
              type="button"
              className="callout-legend-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close legend"
            >
              ×
            </button>

            <div className="callout-legend">
              <h2 id="callout-legend-title">Legend</h2>
              <div className="callout-legend-list">
                {LEGEND_ITEMS.map(({ type, icon, label, desc }) => (
                  <div key={type} className="callout-legend-item">
                    <span className="callout-legend-badge" data-type={type}>
                      <span className="callout-legend-badge-icon">{icon}</span>
                      {label}
                    </span>
                    <span className="callout-legend-desc">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
