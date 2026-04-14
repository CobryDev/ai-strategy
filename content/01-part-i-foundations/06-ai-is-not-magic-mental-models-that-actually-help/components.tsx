"use client";

import { useState, useMemo } from "react";

type Tier = "reliable" | "sometimes" | "not-yet";

interface Task {
  name: string;
  tier: Tier;
  note: string;
}

const TASKS: Task[] = [
  { name: "Summarization of provided text", tier: "reliable", note: "Information is in context; the model compresses, not invents." },
  { name: "First-draft emails & reports", tier: "reliable", note: "Common formats with millions of training examples." },
  { name: "Translation between languages & formats", tier: "reliable", note: "Pattern transformation — well-constrained output space." },
  { name: "Classification & ticket routing", tier: "reliable", note: "Low-cost failure mode; mis-routes are easily caught." },
  { name: "Code generation (standard patterns)", tier: "reliable", note: "Well-documented APIs and common idioms." },
  { name: "Meeting notes & action items", tier: "reliable", note: "Structured extraction from a provided transcript." },
  { name: "Factual Q&A (well-covered topics)", tier: "sometimes", note: "Often correct, but confidence doesn't correlate with accuracy." },
  { name: "Complex multi-step reasoning", tier: "sometimes", note: "Reliability degrades as chain length increases." },
  { name: "Code for uncommon libraries / edge cases", tier: "sometimes", note: "Exactly where bugs are most expensive." },
  { name: "Domain-expert analysis & recommendations", tier: "sometimes", note: "Format looks professional; substance may be wrong." },
  { name: "Long-document synthesis (>50 pages)", tier: "sometimes", note: "Attention drift causes missed details in later sections." },
  { name: "Guaranteed factual accuracy", tier: "not-yet", note: "Hallucinations are structurally inevitable in current architectures." },
  { name: "Knowing what it doesn't know", tier: "not-yet", note: "No reliable metacognition; will answer confidently with fabricated info." },
  { name: "Consistency across long interactions", tier: "not-yet", note: "Constraints and instructions drift as context fills." },
  { name: "Replacing human judgment (high-stakes)", tier: "not-yet", note: "Lacks contextual understanding, ethics, and accountability." },
];

const TIERS: { id: Tier; label: string; color: string; tagBg: string }[] = [
  { id: "reliable", label: "Reliably does well", color: "#16653b", tagBg: "rgba(22,101,59,0.08)" },
  { id: "sometimes", label: "Sometimes does well", color: "#92400e", tagBg: "rgba(146,64,14,0.08)" },
  { id: "not-yet", label: "Cannot do reliably", color: "#7a7f8a", tagBg: "rgba(26,28,32,0.06)" },
];

export function CapabilityFrontier() {
  const [activeTier, setActiveTier] = useState<Tier | null>(null);

  const filtered = useMemo(
    () => activeTier ? TASKS.filter((t) => t.tier === activeTier) : TASKS,
    [activeTier],
  );

  return (
    <figure
      className="cf-figure"
      role="img"
      aria-label="AI capability frontier: tasks mapped to reliable, sometimes, and not-yet tiers."
    >
      <div className="cf-header">
        <span className="cf-suptitle">The capability frontier</span>
      </div>

      <div className="cf-filters">
        <button
          type="button"
          className="cf-filter"
          data-active={activeTier === null || undefined}
          onClick={() => setActiveTier(null)}
        >
          All
        </button>
        {TIERS.map((tier) => (
          <button
            key={tier.id}
            type="button"
            className="cf-filter"
            data-tier={tier.id}
            data-active={activeTier === tier.id || undefined}
            onClick={() => setActiveTier(activeTier === tier.id ? null : tier.id)}
          >
            <span className="cf-filter-dot" style={{ background: tier.color }} />
            {tier.label}
          </button>
        ))}
      </div>

      <div className="cf-list">
        {filtered.map((task) => {
          const tier = TIERS.find((t) => t.id === task.tier)!;
          return (
            <div key={task.name} className="cf-item" data-tier={task.tier}>
              <div className="cf-item-head">
                <span
                  className="cf-item-tag"
                  style={{ background: tier.tagBg, color: tier.color }}
                >
                  {tier.label}
                </span>
                <span className="cf-item-name">{task.name}</span>
              </div>
              <div className="cf-item-note">{task.note}</div>
            </div>
          );
        })}
      </div>
    </figure>
  );
}
