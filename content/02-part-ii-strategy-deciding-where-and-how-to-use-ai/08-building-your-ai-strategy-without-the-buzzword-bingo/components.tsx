"use client";

import { useState } from "react";

interface Step {
  num: number;
  label: string;
  question: string;
  example: string;
  antipattern: string;
}

const STEPS: Step[] = [
  {
    num: 1,
    label: "Objective",
    question: "What does the business actually need?",
    example: "\"Reduce customer churn from 8% to 5%\"",
    antipattern: "\"We need an AI strategy\"",
  },
  {
    num: 2,
    label: "Challenge",
    question: "What's causing the problem?",
    example: "\"Support resolution takes 11 min; 40% of tickets are routine\"",
    antipattern: "Skipped entirely — jumping from objective to tool",
  },
  {
    num: 3,
    label: "Solution",
    question: "What intervention would address it?",
    example: "\"Auto-triage routine tickets; draft responses for agents\"",
    antipattern: "\"We need AI solutions\" (technology-first thinking)",
  },
  {
    num: 4,
    label: "Tool",
    question: "Which specific product fits the solution?",
    example: "Evaluate 3 vendors against defined requirements, pilot the best fit",
    antipattern: "\"We need to buy Copilot\" (vendor-first purchasing)",
  },
];

export function StrategySequence() {
  const [activeNum, setActiveNum] = useState<number | null>(null);
  const active = activeNum !== null ? STEPS.find((s) => s.num === activeNum) : null;

  return (
    <figure
      className="ss-figure"
      role="img"
      aria-label="Four-step strategy sequence: Objective, Challenge, Solution, Tool. Most organizations mistakenly start at step 3 or 4."
    >
      <div className="ss-header">
        <span className="ss-suptitle">The sequence is the strategy</span>
      </div>

      <div className="ss-track">
        {STEPS.map((step, i) => {
          const isWrongStart = step.num >= 3;
          return (
            <button
              key={step.num}
              type="button"
              className="ss-step"
              data-active={step.num === activeNum || undefined}
              data-wrong-start={isWrongStart || undefined}
              onClick={() => setActiveNum(activeNum === step.num ? null : step.num)}
              onMouseEnter={() => setActiveNum(step.num)}
            >
              <div className="ss-step-num">{step.num}</div>
              <div className="ss-step-label">{step.label}</div>
              {i < STEPS.length - 1 && (
                <span className="ss-arrow" aria-hidden="true">→</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="ss-wrong-start-hint">
        <span className="ss-wrong-dot" />
        Where most organizations start
      </div>

      {active && (
        <div className="ss-detail" key={active.num}>
          <div className="ss-detail-q">
            <span className="ss-detail-label">The question</span>
            <span className="ss-detail-value">{active.question}</span>
          </div>
          <div className="ss-detail-row">
            <div className="ss-detail-cell">
              <span className="ss-detail-label ss-detail-label-good">Right</span>
              <span className="ss-detail-value">{active.example}</span>
            </div>
            <div className="ss-detail-cell">
              <span className="ss-detail-label ss-detail-label-bad">Wrong</span>
              <span className="ss-detail-value">{active.antipattern}</span>
            </div>
          </div>
        </div>
      )}
    </figure>
  );
}
