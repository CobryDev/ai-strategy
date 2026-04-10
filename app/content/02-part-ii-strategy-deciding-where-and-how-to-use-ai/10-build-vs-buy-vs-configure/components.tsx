"use client";

import { useState, useCallback } from "react";

type Outcome = "buy" | "configure" | "fine-tune" | "build";

interface TreeNode {
  id: string;
  question: string;
  yes: string | Outcome;
  no: string | Outcome;
  yesLabel?: string;
  noLabel?: string;
}

const NODES: Record<string, TreeNode> = {
  common: {
    id: "common",
    question: "Is this use case common across industries?",
    yesLabel: "Yes — it's a solved problem",
    noLabel: "No — it's specific to us",
    yes: "buy",
    no: "needs-data",
  },
  "needs-data": {
    id: "needs-data",
    question: "Does it require your company's specific data, workflows, or domain logic?",
    yesLabel: "Yes — we need our own data in the loop",
    noLabel: "No — general knowledge is enough",
    yes: "rag-enough",
    no: "buy",
  },
  "rag-enough": {
    id: "rag-enough",
    question: "Can prompts + RAG close the gap — or does the model need to reason, classify, or generate differently at a fundamental level?",
    yesLabel: "Prompts & RAG are enough",
    noLabel: "The model itself needs to change",
    yes: "configure",
    no: "core-product",
  },
  "core-product": {
    id: "core-product",
    question: "Is AI the core of your product — the thing customers pay for?",
    yesLabel: "Yes — AI is the product",
    noLabel: "No — AI supports the product",
    yes: "build",
    no: "fine-tune",
  },
};

const OUTCOMES: Record<Outcome, { label: string; color: string; bg: string; detail: string }> = {
  buy: {
    label: "Buy",
    color: "#16653b",
    bg: "rgba(22,101,59,0.08)",
    detail: "Purchase a commercial SaaS tool. 76% of enterprise AI is purchased, not built. Deploy in days, not months.",
  },
  configure: {
    label: "Configure",
    color: "#0051d3",
    bg: "rgba(0,81,211,0.08)",
    detail: "Foundation model + your data via RAG + custom prompts + workflow integrations. The sweet spot for most enterprise AI.",
  },
  "fine-tune": {
    label: "Fine-tune",
    color: "#92400e",
    bg: "rgba(146,64,14,0.08)",
    detail: "Fine-tune a foundation model for specific behavioral patterns. Verify first: have you exhausted prompt engineering and RAG?",
  },
  build: {
    label: "Build",
    color: "#7a7f8a",
    bg: "rgba(26,28,32,0.06)",
    detail: "Custom model development. Only when AI is your product and proprietary capabilities are your moat. ~33% success rate (MIT).",
  },
};

function isOutcome(val: string): val is Outcome {
  return val in OUTCOMES;
}

export function DecisionTree() {
  const [path, setPath] = useState<{ nodeId: string; choice: "yes" | "no" }[]>([]);

  const currentNodeId = path.length === 0
    ? "common"
    : (() => {
        const last = path[path.length - 1];
        const node = NODES[last.nodeId];
        return node[last.choice];
      })();

  const reachedOutcome = isOutcome(currentNodeId) ? currentNodeId : null;
  const currentNode = reachedOutcome ? null : NODES[currentNodeId];

  const handleChoice = useCallback((choice: "yes" | "no") => {
    if (!currentNode) return;
    setPath((prev) => [...prev, { nodeId: currentNode.id, choice }]);
  }, [currentNode]);

  const reset = useCallback(() => setPath([]), []);

  const goBack = useCallback(() => {
    setPath((prev) => prev.slice(0, -1));
  }, []);

  return (
    <figure className="dt-figure">
      <div className="dt-header">
        <span className="dt-suptitle">Build vs. buy vs. configure</span>
        <span className="dt-step-count">
          {reachedOutcome ? "Done" : `Question ${path.length + 1} of 4`}
        </span>
      </div>

      {/* Breadcrumb trail */}
      {path.length > 0 && (
        <div className="dt-trail">
          {path.map((step, i) => {
            const node = NODES[step.nodeId];
            const choiceLabel = step.choice === "yes"
              ? (node.yesLabel ?? "Yes")
              : (node.noLabel ?? "No");
            return (
              <div key={i} className="dt-trail-step">
                <span className="dt-trail-q">{node.question}</span>
                <span
                  className="dt-trail-a"
                  data-choice={step.choice}
                >
                  {choiceLabel}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Current question */}
      {currentNode && (
        <div className="dt-question-card">
          <div className="dt-question">{currentNode.question}</div>
          <div className="dt-choices">
            <button
              type="button"
              className="dt-choice dt-choice-yes"
              onClick={() => handleChoice("yes")}
            >
              {currentNode.yesLabel ?? "Yes"}
            </button>
            <button
              type="button"
              className="dt-choice dt-choice-no"
              onClick={() => handleChoice("no")}
            >
              {currentNode.noLabel ?? "No"}
            </button>
          </div>
        </div>
      )}

      {/* Outcome */}
      {reachedOutcome && (
        <div
          className="dt-outcome"
          style={{
            borderColor: OUTCOMES[reachedOutcome].color,
            background: OUTCOMES[reachedOutcome].bg,
          }}
        >
          <span
            className="dt-outcome-badge"
            style={{ color: OUTCOMES[reachedOutcome].color }}
          >
            {OUTCOMES[reachedOutcome].label}
          </span>
          <p className="dt-outcome-detail">
            {OUTCOMES[reachedOutcome].detail}
          </p>
        </div>
      )}

      <div className="dt-actions">
        {path.length > 0 && (
          <button type="button" className="dt-action" onClick={goBack}>
            ← Back
          </button>
        )}
        {path.length > 0 && (
          <button type="button" className="dt-action" onClick={reset}>
            Start over
          </button>
        )}
      </div>
    </figure>
  );
}
