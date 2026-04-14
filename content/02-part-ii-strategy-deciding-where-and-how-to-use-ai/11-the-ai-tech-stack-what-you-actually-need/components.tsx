"use client";

import { useState } from "react";

interface Layer {
  num: number;
  name: string;
  color: string;
  mvp: string;
  full: string;
  flowStep: string;
}

const LAYERS: Layer[] = [
  {
    num: 4,
    name: "Integration",
    color: "#5e5e62",
    mvp: "Embed AI in one existing tool",
    full: "APIs, middleware, existing tool connections across workflows",
    flowStep: "User asks a question in their existing tool",
  },
  {
    num: 6,
    name: "Governance",
    color: "#7a7f8a",
    mvp: "AUP, data classification, API key controls, basic logging",
    full: "Access control, audit logging, policy enforcement, content filters",
    flowStep: "Permission check; request logged for audit",
  },
  {
    num: 2,
    name: "Orchestration",
    color: "#0051d3",
    mvp: "Direct API calls with well-engineered system prompts",
    full: "Prompt management, chains & workflows, agent frameworks, routing",
    flowStep: "Query formatted → embedding request → retrieval call → prompt assembled",
  },
  {
    num: 3,
    name: "Data Infrastructure",
    color: "#16653b",
    mvp: "Minimal RAG pipeline with managed vector DB (skip if not needed)",
    full: "Vector databases, embeddings & chunking, data connectors to source systems",
    flowStep: "Vector DB searched for relevant documents; top matches returned",
  },
  {
    num: 1,
    name: "Foundation Model",
    color: "#0051d3",
    mvp: "One commercial API provider",
    full: "Commercial APIs, self-hosted open-source, hybrid routing layer",
    flowStep: "Prompt + retrieved context sent to LLM; response generated",
  },
  {
    num: 5,
    name: "Evaluation & Monitoring",
    color: "#92400e",
    mvp: "3–5 quality metrics, reviewed weekly (spreadsheet is fine)",
    full: "Output quality eval, cost tracking, latency monitoring, drift detection",
    flowStep: "Response scored for quality; metrics logged",
  },
];

const FLOW_ORDER = [4, 6, 2, 3, 1, 5, 4, 6];
const FLOW_LABELS = [
  "User asks question",
  "Permission check & log",
  "Format query & build prompt",
  "Retrieve relevant documents",
  "Generate response",
  "Score quality",
  "Return response to user",
  "Log full interaction",
];

export function TechStackDiagram() {
  const [activeLayer, setActiveLayer] = useState<number | null>(null);
  const [showMvp, setShowMvp] = useState(false);

  const active = activeLayer !== null ? LAYERS.find((l) => l.num === activeLayer) : null;

  return (
    <figure className="ts-figure">
      <div className="ts-header">
        <span className="ts-suptitle">The six-layer AI stack</span>
        <div className="ts-toggles">
          <button
            type="button"
            className="ts-toggle"
            data-active={!showMvp || undefined}
            onClick={() => setShowMvp(false)}
          >
            Full stack
          </button>
          <button
            type="button"
            className="ts-toggle"
            data-active={showMvp || undefined}
            onClick={() => setShowMvp(true)}
          >
            Minimum viable
          </button>
        </div>
      </div>

      <div className="ts-body">
        {/* Stack column */}
        <div className="ts-stack">
          {LAYERS.map((layer) => (
            <button
              key={layer.num}
              type="button"
              className="ts-layer"
              data-active={activeLayer === layer.num || undefined}
              onClick={() => setActiveLayer(activeLayer === layer.num ? null : layer.num)}
              onMouseEnter={() => setActiveLayer(layer.num)}
            >
              <span className="ts-layer-num" style={{ background: layer.color }}>
                {layer.num}
              </span>
              <span className="ts-layer-name">{layer.name}</span>
              <span className="ts-layer-desc">
                {showMvp ? layer.mvp : layer.full}
              </span>
            </button>
          ))}
        </div>

        {/* Flow column */}
        <div className="ts-flow">
          <div className="ts-flow-title">Request flow</div>
          {FLOW_ORDER.map((layerNum, i) => {
            const layer = LAYERS.find((l) => l.num === layerNum)!;
            return (
              <div
                key={i}
                className="ts-flow-step"
                data-highlight={activeLayer === layerNum || undefined}
              >
                <span
                  className="ts-flow-dot"
                  style={{ background: layer.color }}
                />
                <span className="ts-flow-label">{FLOW_LABELS[i]}</span>
                {i < FLOW_ORDER.length - 1 && (
                  <span className="ts-flow-line" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {active && (
        <div className="ts-detail" key={`${active.num}-${showMvp}`}>
          <div className="ts-detail-head">
            <span className="ts-detail-badge" style={{ background: active.color }}>
              Layer {active.num}
            </span>
            <span className="ts-detail-name">{active.name}</span>
          </div>
          <div className="ts-detail-row">
            <div className="ts-detail-cell">
              <span className="ts-detail-label">In the flow</span>
              <span className="ts-detail-value">{active.flowStep}</span>
            </div>
            <div className="ts-detail-cell">
              <span className="ts-detail-label">{showMvp ? "Day-one version" : "Full version"}</span>
              <span className="ts-detail-value">{showMvp ? active.mvp : active.full}</span>
            </div>
          </div>
        </div>
      )}
    </figure>
  );
}
