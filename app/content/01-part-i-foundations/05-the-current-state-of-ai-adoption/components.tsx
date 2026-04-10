"use client";

import { useState } from "react";

interface Survey {
  id: string;
  source: string;
  pct: number;
  measured: string;
  sample: string;
  note: string;
}

const SURVEYS: Survey[] = [
  {
    id: "mckinsey",
    source: "McKinsey",
    pct: 78,
    measured: "Organizations using AI \"in at least one business function\"",
    sample: "~1,400 respondents, skewing senior leaders at large firms",
    note: "Self-reported, broad definition of \"use.\" Includes any experimentation, any function, any scale.",
  },
  {
    id: "oecd",
    source: "OECD",
    pct: 20,
    measured: "Firms that have adopted AI technologies",
    sample: "Official government statistics across member countries",
    note: "Stricter definition requiring actual deployment, not just experimentation. Covers all firm sizes.",
  },
  {
    id: "census",
    source: "U.S. Census",
    pct: 10,
    measured: "Firms that used AI in the previous two weeks",
    sample: "~800,000 U.S. businesses of all sizes",
    note: "Most rigorous methodology. Short time window captures active use, not one-off trials. All sectors, all sizes.",
  },
];

export function AdoptionGap() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = activeId ? SURVEYS.find((s) => s.id === activeId) : null;

  return (
    <figure
      className="ag-figure"
      role="img"
      aria-label="Three surveys measuring AI adoption in the same period report 78%, 20%, and 10% — the gap is about methodology, not reality."
    >
      <div className="ag-header">
        <span className="ag-suptitle">The adoption measurement gap</span>
        <span className="ag-period">Same period, same topic, different answers</span>
      </div>

      <div className="ag-bars">
        {SURVEYS.map((s) => (
          <button
            key={s.id}
            type="button"
            className="ag-row"
            data-active={s.id === activeId || undefined}
            onClick={() => setActiveId(activeId === s.id ? null : s.id)}
            onMouseEnter={() => setActiveId(s.id)}
          >
            <div className="ag-row-label">{s.source}</div>
            <div className="ag-bar-track">
              <div
                className="ag-bar-fill"
                style={{ width: `${s.pct}%` }}
              />
              <span className="ag-bar-pct">{s.pct}%</span>
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div className="ag-detail" key={active.id}>
          <div className="ag-detail-row">
            <span className="ag-detail-label">What they measured</span>
            <span className="ag-detail-value">{active.measured}</span>
          </div>
          <div className="ag-detail-row">
            <span className="ag-detail-label">Who they asked</span>
            <span className="ag-detail-value">{active.sample}</span>
          </div>
          <div className="ag-detail-row">
            <span className="ag-detail-label">Why it matters</span>
            <span className="ag-detail-value">{active.note}</span>
          </div>
        </div>
      )}

      <div className="ag-footnote">
        Hover or tap a bar to see what each survey actually measured.
      </div>
    </figure>
  );
}
