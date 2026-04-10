"use client";

import { useState } from "react";

const HUB_ITEMS = [
  "AI platform & shared infrastructure",
  "Governance standards & enforcement",
  "Evaluation frameworks & monitoring",
  "Vendor relationships & procurement",
  "Security & compliance",
  "Org-wide AI literacy programs",
];

interface Spoke {
  id: string;
  name: string;
  owns: string[];
}

const SPOKES: Spoke[] = [
  {
    id: "engineering",
    name: "Engineering",
    owns: [
      "Code assistant adoption & review standards",
      "CI/CD integration for AI-generated code",
      "Developer-specific prompt patterns",
    ],
  },
  {
    id: "support",
    name: "Support",
    owns: [
      "Triage & deflection workflow design",
      "Escalation path configuration",
      "Agent training on AI-assisted tools",
    ],
  },
  {
    id: "legal",
    name: "Legal & Compliance",
    owns: [
      "Contract review prompt engineering",
      "Regulatory compliance monitoring",
      "Domain-specific accuracy thresholds",
    ],
  },
  {
    id: "marketing",
    name: "Marketing",
    owns: [
      "Content generation workflows",
      "Brand voice & editorial guidelines",
      "Campaign personalization rules",
    ],
  },
  {
    id: "ops",
    name: "Operations",
    owns: [
      "Process automation design",
      "Demand forecasting configuration",
      "Workflow-specific quality monitoring",
    ],
  },
];

export function HubAndSpoke() {
  const [activeSpoke, setActiveSpoke] = useState<string | null>(null);
  const active = activeSpoke ? SPOKES.find((s) => s.id === activeSpoke) : null;

  return (
    <figure className="hs-figure">
      <div className="hs-header">
        <span className="hs-suptitle">Hub-and-spoke operating model</span>
        <span className="hs-subtitle">3× more likely to scale AI successfully (Dataiku)</span>
      </div>

      <div className="hs-layout">
        {/* Hub */}
        <div className="hs-hub">
          <div className="hs-hub-label">Central platform team</div>
          <div className="hs-hub-subtitle">The hub owns</div>
          <ul className="hs-hub-list">
            {HUB_ITEMS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Spokes */}
        <div className="hs-spokes">
          <div className="hs-spokes-title">Business unit spokes</div>
          <div className="hs-spoke-buttons">
            {SPOKES.map((spoke) => (
              <button
                key={spoke.id}
                type="button"
                className="hs-spoke-btn"
                data-active={spoke.id === activeSpoke || undefined}
                onClick={() => setActiveSpoke(activeSpoke === spoke.id ? null : spoke.id)}
                onMouseEnter={() => setActiveSpoke(spoke.id)}
              >
                {spoke.name}
              </button>
            ))}
          </div>

          {active ? (
            <div className="hs-spoke-detail" key={active.id}>
              <div className="hs-spoke-detail-label">{active.name} owns</div>
              <ul className="hs-spoke-detail-list">
                {active.owns.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="hs-spoke-hint">
              Hover or tap a business unit to see what they own
            </div>
          )}
        </div>
      </div>

      <div className="hs-boundary">
        <span className="hs-boundary-line" />
        <span className="hs-boundary-text">
          Boundary: where domain expertise matters more than platform expertise
        </span>
        <span className="hs-boundary-line" />
      </div>
    </figure>
  );
}
