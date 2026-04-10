"use client";

import { useMemo, useState, type CSSProperties } from "react";

type MatrixUseCase = {
  id: string;
  shortLabel: string;
  name: string;
  impact: number;
  feasibility: number;
  quadrant:
    | "do-first"
    | "invest"
    | "resources-allow"
    | "dont-do";
  recommendation: string;
  detail: string;
  whyItLandsHere: string;
};

const USE_CASES: MatrixUseCase[] = [
  {
    id: "knowledge-retrieval",
    shortLabel: "1",
    name: "Internal knowledge retrieval for sales and support",
    impact: 84,
    feasibility: 82,
    quadrant: "do-first",
    recommendation: "Primary use case",
    detail:
      "A strong first deployment because the value is immediate, the tasks are frequent, and humans remain in the loop when the answer quality is imperfect.",
    whyItLandsHere:
      "Most organizations already have the source material, the integration surface is manageable, and better retrieval compounds across multiple teams.",
  },
  {
    id: "support-triage",
    shortLabel: "2",
    name: "Support triage and draft response assistant",
    impact: 78,
    feasibility: 74,
    quadrant: "do-first",
    recommendation: "Primary use case",
    detail:
      "This is often the quickest path to measurable savings because ticket volume is high and the workflow is structured enough for AI to assist reliably.",
    whyItLandsHere:
      "The impact is high, but rollout still needs confidence thresholds, escalation logic, and clean integrations with the support stack.",
  },
  {
    id: "contract-review",
    shortLabel: "3",
    name: "Contract anomaly review for legal and procurement",
    impact: 81,
    feasibility: 38,
    quadrant: "invest",
    recommendation: "Invest to make feasible",
    detail:
      "The upside is real, but the data, review standards, and governance burden usually mean this needs upfront enablement before it can scale safely.",
    whyItLandsHere:
      "Accuracy demands are high, the tolerance for false positives is low, and legal workflows often depend on fragmented document sources.",
  },
  {
    id: "marketing-drafting",
    shortLabel: "4",
    name: "Marketing first-draft generation",
    impact: 36,
    feasibility: 79,
    quadrant: "resources-allow",
    recommendation: "Useful, but not a first bet",
    detail:
      "Teams can get fast local productivity wins here, but the enterprise-level value is usually smaller than the excitement around the category suggests.",
    whyItLandsHere:
      "It is easy to trial and easy to adopt, but the strategic payoff is often modest unless content throughput is a major bottleneck.",
  },
  {
    id: "legal-advice-bot",
    shortLabel: "5",
    name: "Autonomous legal advice bot for customers",
    impact: 22,
    feasibility: 18,
    quadrant: "dont-do",
    recommendation: "Avoid",
    detail:
      "This combines low trust tolerance, high regulatory exposure, and severe downside if the model gives a wrong answer with confidence.",
    whyItLandsHere:
      "Even if the concept sounds bold, the operational and legal risk is too high relative to the practical value for most organizations.",
  },
];

const QUADRANTS = [
  {
    id: "invest",
    title: "Invest to make feasible",
    subtitle: "High impact, low feasibility",
  },
  {
    id: "do-first",
    title: "Do first",
    subtitle: "High impact, high feasibility",
  },
  {
    id: "dont-do",
    title: "Don't do",
    subtitle: "Low impact, low feasibility",
  },
  {
    id: "resources-allow",
    title: "Do if resources allow",
    subtitle: "Low impact, high feasibility",
  },
] as const;

function pointStyle(useCase: MatrixUseCase): CSSProperties {
  return {
    "--matrix-x": `${useCase.feasibility}%`,
    "--matrix-y": `${100 - useCase.impact}%`,
  } as CSSProperties;
}

export function UseCasePrioritizationMatrix() {
  const [activeId, setActiveId] = useState(USE_CASES[0].id);
  const activeUseCase = useMemo(
    () => USE_CASES.find((useCase) => useCase.id === activeId) ?? USE_CASES[0],
    [activeId],
  );
  const activeQuadrant = QUADRANTS.find(
    (quadrant) => quadrant.id === activeUseCase.quadrant,
  );

  return (
    <figure className="use-case-matrix">
      <div className="use-case-matrix-shell">
        <div className="use-case-matrix-frame">
          <div className="use-case-matrix-axis use-case-matrix-axis-x">
            Feasibility
          </div>
          <div className="use-case-matrix-axis use-case-matrix-axis-y">
            Business impact
          </div>

          <div className="use-case-matrix-grid" aria-hidden="true">
            {QUADRANTS.map((quadrant) => (
              <div
                key={quadrant.id}
                className="use-case-matrix-quadrant"
                data-quadrant={quadrant.id}
              >
                <div className="use-case-matrix-quadrant-label">
                  <span>{quadrant.title}</span>
                  <small>{quadrant.subtitle}</small>
                </div>
              </div>
            ))}
            <div className="use-case-matrix-midline use-case-matrix-midline-x" />
            <div className="use-case-matrix-midline use-case-matrix-midline-y" />
          </div>

          <div className="use-case-matrix-points">
            {USE_CASES.map((useCase) => (
              <button
                key={useCase.id}
                type="button"
                className="use-case-matrix-point"
                data-quadrant={useCase.quadrant}
                data-active={activeUseCase.id === useCase.id}
                style={pointStyle(useCase)}
                onMouseEnter={() => setActiveId(useCase.id)}
                onFocus={() => setActiveId(useCase.id)}
                onClick={() => setActiveId(useCase.id)}
                aria-label={`${useCase.name}. Impact ${useCase.impact}. Feasibility ${useCase.feasibility}.`}
              >
                <span className="use-case-matrix-dot">
                  {useCase.shortLabel}
                </span>
              </button>
            ))}
          </div>

          <div
            className="use-case-matrix-scale use-case-matrix-scale-x"
            aria-hidden="true"
          >
            <span>Low</span>
            <span>High</span>
          </div>
          <div
            className="use-case-matrix-scale use-case-matrix-scale-y"
            aria-hidden="true"
          >
            <span>High</span>
            <span>Low</span>
          </div>
        </div>

        <aside
          className="use-case-matrix-modal"
          data-quadrant={activeUseCase.quadrant}
          aria-live="polite"
        >
          <div className="use-case-matrix-modal-labels">
            <span className="use-case-matrix-modal-step">
              Point {activeUseCase.shortLabel}
            </span>
            <span className="use-case-matrix-modal-quadrant">
              {activeQuadrant?.title}
            </span>
          </div>

          <h3 className="use-case-matrix-modal-title">
            {activeUseCase.name}
          </h3>

          <p className="use-case-matrix-modal-summary">
            {activeUseCase.recommendation}
          </p>

          <div className="use-case-matrix-modal-metrics">
            <div className="use-case-matrix-metric">
              <div className="use-case-matrix-metric-head">
                <span>Impact</span>
                <strong>{activeUseCase.impact}</strong>
              </div>
              <div className="use-case-matrix-metric-bar">
                <span style={{ width: `${activeUseCase.impact}%` }} />
              </div>
            </div>
            <div className="use-case-matrix-metric">
              <div className="use-case-matrix-metric-head">
                <span>Feasibility</span>
                <strong>{activeUseCase.feasibility}</strong>
              </div>
              <div className="use-case-matrix-metric-bar">
                <span style={{ width: `${activeUseCase.feasibility}%` }} />
              </div>
            </div>
          </div>

          <p className="use-case-matrix-modal-body">
            {activeUseCase.detail}
          </p>
          <p className="use-case-matrix-modal-why">
            {activeUseCase.whyItLandsHere}
          </p>

          <div className="use-case-matrix-modal-note">
            Hover or tap another point to inspect a different use case.
          </div>
        </aside>
      </div>

      <figcaption className="use-case-matrix-caption">
        Example scoring for common enterprise AI use cases. Use this to
        pressure-test candidate ideas before you commit budget, integration
        time, and executive attention.
      </figcaption>
    </figure>
  );
}
