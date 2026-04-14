"use client";

import { useState } from "react";

interface Phase {
  id: string;
  num: number;
  name: string;
  weeks: string;
  weekStart: number;
  weekEnd: number;
  color: string;
  deliverables: string[];
  gate: string;
}

const PHASES: Phase[] = [
  {
    id: "p0",
    num: 0,
    name: "Constrain the Chaos",
    weeks: "Week 0",
    weekStart: 0,
    weekEnd: 0,
    color: "#7a7f8a",
    deliverables: [
      "Select primary use case + one backup",
      "Named executive sponsor",
      "One-page business case with scope boundaries",
    ],
    gate: "Use case selected, sponsor named, scope documented",
  },
  {
    id: "p1",
    num: 1,
    name: "Define & Assess",
    weeks: "Weeks 1–3",
    weekStart: 1,
    weekEnd: 3,
    color: "#0051d3",
    deliverables: [
      "Current workflow mapped in detail",
      "Data & compliance assessment complete",
      "Production-oriented design: human-AI interaction, integration points, monitoring approach",
    ],
    gate: "Problem statement, KPIs, workflow maps, data assessment, architecture diagram — all present",
  },
  {
    id: "p2",
    num: 2,
    name: "Build the Foundation",
    weeks: "Weeks 4–6",
    weekStart: 4,
    weekEnd: 6,
    color: "#16653b",
    deliverables: [
      "Dev / staging / prod environments with IAM & security",
      "Data pipelines & context layer (RAG or feature store)",
      "Observability, guardrails, logging from day one",
    ],
    gate: "Infrastructure operational, data flowing, monitoring live",
  },
  {
    id: "p3",
    num: 3,
    name: "Build & Integrate",
    weeks: "Weeks 7–10",
    weekStart: 7,
    weekEnd: 10,
    color: "#92400e",
    deliverables: [
      "Model & workflow implementation (managed APIs first)",
      "Integration with production systems",
      "Staging tests & security review passed",
    ],
    gate: "End-to-end workflow running in staging with real data",
  },
  {
    id: "p4",
    num: 4,
    name: "Shadow Mode & Measurement",
    weeks: "Weeks 11–13",
    weekStart: 11,
    weekEnd: 13,
    color: "#0051d3",
    deliverables: [
      "AI running alongside humans, recommending not executing",
      "Measuring against Phase 1 baseline KPIs",
      "Documented assessment: what works, what doesn't, what to change",
    ],
    gate: "Production deployment decision with evidence",
  },
];

const TOTAL_WEEKS = 13;

export function NinetyDayTimeline() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = activeId ? PHASES.find((p) => p.id === activeId) : null;

  return (
    <figure className="nd-figure">
      <div className="nd-header">
        <span className="nd-suptitle">90-day adoption playbook</span>
        <span className="nd-subtitle">5 phases, Week 0 → Week 13</span>
      </div>

      {/* Gantt bars */}
      <div className="nd-gantt">
        {/* Week scale */}
        <div className="nd-scale">
          {Array.from({ length: TOTAL_WEEKS + 1 }, (_, i) => (
            <span key={i} className="nd-scale-tick">
              {i === 0 ? "0" : i % 3 === 0 || i === TOTAL_WEEKS ? String(i) : ""}
            </span>
          ))}
        </div>

        {PHASES.map((phase) => {
          const left = (phase.weekStart / TOTAL_WEEKS) * 100;
          const width = ((phase.weekEnd - phase.weekStart + 1) / TOTAL_WEEKS) * 100;
          const isActive = phase.id === activeId;

          return (
            <button
              key={phase.id}
              type="button"
              className="nd-row"
              data-active={isActive || undefined}
              onClick={() => setActiveId(activeId === phase.id ? null : phase.id)}
              onMouseEnter={() => setActiveId(phase.id)}
            >
              <div className="nd-row-label">
                <span className="nd-phase-num">P{phase.num}</span>
                <span className="nd-phase-name">{phase.name}</span>
              </div>
              <div className="nd-bar-track">
                <div
                  className="nd-bar"
                  style={{
                    left: `${left}%`,
                    width: `${width}%`,
                    background: phase.color,
                    opacity: isActive ? 1 : 0.5,
                  }}
                />
              </div>
              <span className="nd-weeks">{phase.weeks}</span>
            </button>
          );
        })}
      </div>

      {active && (
        <div className="nd-detail" key={active.id}>
          <div className="nd-detail-head">
            <span className="nd-detail-badge" style={{ background: active.color }}>
              Phase {active.num}
            </span>
            <span className="nd-detail-name">{active.name}</span>
            <span className="nd-detail-weeks">{active.weeks}</span>
          </div>
          <div className="nd-detail-body">
            <div className="nd-detail-cell">
              <span className="nd-detail-label">Key deliverables</span>
              <ul className="nd-deliverables">
                {active.deliverables.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
            <div className="nd-detail-cell">
              <span className="nd-detail-label">Gate criteria</span>
              <span className="nd-detail-value">{active.gate}</span>
            </div>
          </div>
        </div>
      )}
    </figure>
  );
}
