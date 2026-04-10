"use client";

import { useState } from "react";

interface FunnelStage {
  id: string;
  count: number;
  label: string;
  killer: string;
  detail: string;
}

const STAGES: FunnelStage[] = [
  {
    id: "launched",
    count: 33,
    label: "PoCs launched",
    killer: "",
    detail: "The average enterprise launches 33 AI proofs-of-concept. Most begin with enthusiasm, executive sponsorship, and a working demo.",
  },
  {
    id: "unclear-value",
    count: 22,
    label: "Survive value review",
    killer: "Unclear business value",
    detail: "~11 die here. The PoC works technically but nobody defined a measurable business problem. \"It's cool\" is not a business case.",
  },
  {
    id: "cost-scope",
    count: 14,
    label: "Survive cost & scope",
    killer: "Cost overruns & scope creep",
    detail: "~8 more die. Production costs were never budgeted: auth, compliance, monitoring, error handling, training. The 6–12 month gap nobody planned for.",
  },
  {
    id: "integration",
    count: 8,
    label: "Survive integration",
    killer: "Integration gaps",
    detail: "~6 more die. The demo used clean data and a sandbox. Real systems need API integrations, data pipelines, access controls, and edge-case handling.",
  },
  {
    id: "production",
    count: 4,
    label: "Reach production",
    killer: "Pilot purgatory",
    detail: "~4 more die in limbo — consuming resources, producing no value, too alive to kill, too broken to ship. Only 4 of 33 make it.",
  },
];

const MAX = STAGES[0].count;

export function PocFunnel() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = activeId ? STAGES.find((s) => s.id === activeId) : null;

  return (
    <figure
      className="pf-figure"
      role="img"
      aria-label="PoC-to-production funnel: of 33 proofs-of-concept launched, only 4 reach production."
    >
      <div className="pf-header">
        <span className="pf-suptitle">PoC-to-production funnel</span>
        <span className="pf-source">IDC & S&P Global data</span>
      </div>

      <div className="pf-funnel">
        {STAGES.map((stage) => {
          const widthPct = (stage.count / MAX) * 100;
          const isActive = stage.id === activeId;
          const isLast = stage.id === "production";

          return (
            <button
              key={stage.id}
              type="button"
              className="pf-stage"
              data-active={isActive || undefined}
              data-last={isLast || undefined}
              onClick={() => setActiveId(activeId === stage.id ? null : stage.id)}
              onMouseEnter={() => setActiveId(stage.id)}
            >
              <div className="pf-bar-row">
                <div className="pf-bar-wrap">
                  <div
                    className="pf-bar"
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
                <span className="pf-count">{stage.count}</span>
              </div>
              <div className="pf-stage-label">
                {stage.label}
                {stage.killer && (
                  <span className="pf-killer">
                    <span className="pf-killer-arrow">↑</span> killed by: {stage.killer}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {active && (
        <div className="pf-detail" key={active.id}>
          {active.detail}
        </div>
      )}

      <div className="pf-takeaway">
        <strong>88% of AI PoCs never reach production.</strong> The fix: design every pilot as phase one of a production deployment.
      </div>
    </figure>
  );
}
