"use client";

import { useState } from "react";

interface Category {
  id: string;
  label: string;
  level: number;
  governance: string;
  risk: string;
  skills: string;
  roi: string;
}

const CATEGORIES: Category[] = [
  {
    id: "assistive",
    label: "Assistive",
    level: 1,
    governance: "Acceptable use policies, data classification, training",
    risk: "Human catches errors before they matter",
    skills: "Training, change management, integration",
    roi: "Days",
  },
  {
    id: "analytical",
    label: "Analytical",
    level: 2,
    governance: "+ Model validation, performance monitoring, bias testing",
    risk: "Delayed detection; wrong patterns inform wrong decisions",
    skills: "+ Data engineering, ML ops, evaluation design",
    roi: "Weeks to months",
  },
  {
    id: "automated",
    label: "Automated",
    level: 3,
    governance: "+ Evaluation frameworks, monitoring, escalation paths",
    risk: "Errors reach customers or affect operations directly",
    skills: "+ Process design, evaluation engineering, monitoring infra",
    roi: "Months",
  },
  {
    id: "agentic",
    label: "Agentic",
    level: 4,
    governance: "+ Real-time oversight, action-level audit trails, intervention capabilities",
    risk: "Cascading actions on a wrong premise before anyone notices",
    skills: "+ Safety engineering, guardrail design, new system architecture",
    roi: "Early / uncertain",
  },
];

const DIMENSIONS = [
  { key: "governance" as const, label: "Governance" },
  { key: "risk" as const, label: "Blast radius" },
  { key: "skills" as const, label: "Skills needed" },
  { key: "roi" as const, label: "ROI timeline" },
];

export function AutonomySpectrum() {
  const [activeId, setActiveId] = useState<string>("assistive");
  const active = CATEGORIES.find((c) => c.id === activeId) ?? CATEGORIES[0];

  return (
    <figure
      className="as-figure"
      role="img"
      aria-label="AI autonomy spectrum: governance, risk, skills, and ROI scale with autonomy from assistive to agentic."
    >
      <div className="as-header">
        <span className="as-suptitle">Autonomy spectrum</span>
        <span className="as-arrow">Low → High</span>
      </div>

      <div className="as-columns">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className="as-col"
            data-active={cat.id === activeId || undefined}
            onClick={() => setActiveId(cat.id)}
            onMouseEnter={() => setActiveId(cat.id)}
          >
            <div className="as-step-bar">
              <div
                className="as-step-fill"
                style={{ height: `${cat.level * 25}%` }}
              />
            </div>
            <div className="as-col-label">{cat.label}</div>
          </button>
        ))}
      </div>

      <div className="as-detail" key={active.id}>
        <div className="as-detail-head">
          <span className="as-detail-badge">{active.label}</span>
          <span className="as-detail-level">
            Autonomy level {active.level}/4
          </span>
        </div>
        <div className="as-detail-grid">
          {DIMENSIONS.map((dim) => (
            <div key={dim.key} className="as-dim">
              <div className="as-dim-label">{dim.label}</div>
              <div className="as-dim-value">
                {active[dim.key]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}
