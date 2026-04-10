"use client";

import { useState, useCallback } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceArea,
  ReferenceLine,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface UseCase {
  id: string;
  name: string;
  feasibility: number;
  impact: number;
  quadrant: "do-first" | "invest" | "resources-allow" | "dont-do";
  recommendation: string;
  detail: string;
}

const USE_CASES: UseCase[] = [
  {
    id: "knowledge-retrieval",
    name: "Internal knowledge retrieval",
    feasibility: 82,
    impact: 84,
    quadrant: "do-first",
    recommendation: "Do first",
    detail:
      "High-frequency task, data already exists internally, humans stay in the loop. Strong first deployment.",
  },
  {
    id: "support-triage",
    name: "Support triage & draft responses",
    feasibility: 74,
    impact: 78,
    quadrant: "do-first",
    recommendation: "Do first",
    detail:
      "Structured workflow with high ticket volume. Quickest path to measurable cost savings.",
  },
  {
    id: "contract-review",
    name: "Contract anomaly review",
    feasibility: 32,
    impact: 81,
    quadrant: "invest",
    recommendation: "Invest to make feasible",
    detail:
      "Real upside, but accuracy demands are high and legal document sources are usually fragmented. Needs enablement work first.",
  },
  {
    id: "marketing-drafting",
    name: "Marketing first-draft generation",
    feasibility: 79,
    impact: 36,
    quadrant: "resources-allow",
    recommendation: "Do if resources allow",
    detail:
      "Easy to trial, but strategic payoff is modest unless content throughput is a genuine bottleneck.",
  },
  {
    id: "legal-advice-bot",
    name: "Autonomous legal advice bot",
    feasibility: 18,
    impact: 22,
    quadrant: "dont-do",
    recommendation: "Don't do",
    detail:
      "Low trust tolerance, high regulatory exposure, severe downside if the model hallucinates with confidence.",
  },
  {
    id: "code-assist",
    name: "Developer code assistance",
    feasibility: 88,
    impact: 72,
    quadrant: "do-first",
    recommendation: "Do first",
    detail:
      "55% of enterprise AI departmental spend. Proven gains for boilerplate, tests, and documentation. Manage review burden.",
  },
  {
    id: "demand-forecasting",
    name: "Demand forecasting",
    feasibility: 45,
    impact: 65,
    quadrant: "invest",
    recommendation: "Invest to make feasible",
    detail:
      "Clear cost-savings story, but requires clean historical data and integration with inventory systems.",
  },
];

const QUADRANT_COLORS = {
  "do-first": "rgba(0, 81, 211, 0.07)",
  invest: "rgba(244, 180, 0, 0.07)",
  "resources-allow": "rgba(94, 94, 98, 0.05)",
  "dont-do": "rgba(26, 28, 32, 0.04)",
};

const DOT_COLORS: Record<string, string> = {
  "do-first": "#0051d3",
  invest: "#d4960c",
  "resources-allow": "#5e5e62",
  "dont-do": "#7a7f8a",
};

function CustomDot(props: { cx?: number; cy?: number; payload?: UseCase; activeId?: string; [key: string]: unknown }) {
  const { cx, cy, payload, activeId } = props;
  if (cx == null || cy == null || !payload) return null;

  const isActive = payload.id === activeId;
  const color = DOT_COLORS[payload.quadrant] ?? "#5e5e62";
  const r = isActive ? 9 : 7;

  return (
    <g>
      {isActive && (
        <circle cx={cx} cy={cy} r={16} fill={color} opacity={0.12} />
      )}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={color}
        stroke="#fff"
        strokeWidth={2.5}
        style={{ cursor: "pointer", transition: "r 0.15s ease" }}
      />
    </g>
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: UseCase }[];
}

function CustomTooltipContent({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;

  return (
    <div className="ucm-tooltip">
      <div className="ucm-tooltip-head">
        <span
          className="ucm-tooltip-badge"
          style={{ color: DOT_COLORS[d.quadrant] }}
        >
          {d.recommendation}
        </span>
      </div>
      <div className="ucm-tooltip-title">{d.name}</div>
      <div className="ucm-tooltip-detail">{d.detail}</div>
      <div className="ucm-tooltip-scores">
        <span>Impact {d.impact}</span>
        <span>Feasibility {d.feasibility}</span>
      </div>
    </div>
  );
}

export function UseCasePrioritizationMatrix() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleMouseEnter = useCallback((_: unknown, index: number) => {
    setActiveId(USE_CASES[index]?.id ?? null);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setActiveId(null);
  }, []);

  return (
    <figure className="ucm-figure">
      <ResponsiveContainer width="100%" aspect={1.15}>
        <ScatterChart margin={{ top: 24, right: 24, bottom: 48, left: 12 }}>
          <CartesianGrid
            stroke="rgba(26,28,32,0.06)"
            strokeDasharray="3 3"
          />

          {/* quadrant backgrounds */}
          <ReferenceArea x1={0} x2={50} y1={50} y2={100} fill={QUADRANT_COLORS["invest"]} fillOpacity={1} ifOverflow="hidden" label={{ value: "Invest to make feasible", position: "insideTopLeft", style: { fontSize: 11, fill: "#92400e", fontFamily: "var(--font-label), var(--font-sans), sans-serif", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.04em" }, offset: 12 }} />
          <ReferenceArea x1={50} x2={100} y1={50} y2={100} fill={QUADRANT_COLORS["do-first"]} fillOpacity={1} ifOverflow="hidden" label={{ value: "Do first", position: "insideTopRight", style: { fontSize: 11, fill: "#0051d3", fontFamily: "var(--font-label), var(--font-sans), sans-serif", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.04em" }, offset: 12 }} />
          <ReferenceArea x1={0} x2={50} y1={0} y2={50} fill={QUADRANT_COLORS["dont-do"]} fillOpacity={1} ifOverflow="hidden" label={{ value: "Don't do", position: "insideBottomLeft", style: { fontSize: 11, fill: "#5e5e62", fontFamily: "var(--font-label), var(--font-sans), sans-serif", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.04em" }, offset: 12 }} />
          <ReferenceArea x1={50} x2={100} y1={0} y2={50} fill={QUADRANT_COLORS["resources-allow"]} fillOpacity={1} ifOverflow="hidden" label={{ value: "Do if resources allow", position: "insideBottomRight", style: { fontSize: 11, fill: "#5e5e62", fontFamily: "var(--font-label), var(--font-sans), sans-serif", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.04em" }, offset: 12 }} />

          <ReferenceLine x={50} stroke="rgba(26,28,32,0.12)" strokeWidth={1} />
          <ReferenceLine y={50} stroke="rgba(26,28,32,0.12)" strokeWidth={1} />

          <XAxis
            type="number"
            dataKey="feasibility"
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tick={{ fontSize: 11, fill: "#5e5e62", fontFamily: "var(--font-label), var(--font-sans), sans-serif" }}
            tickLine={false}
            axisLine={{ stroke: "rgba(26,28,32,0.12)" }}
            label={{
              value: "FEASIBILITY",
              position: "insideBottom",
              offset: -32,
              style: {
                fontSize: 11,
                fill: "#5e5e62",
                fontFamily: "var(--font-label), var(--font-sans), sans-serif",
                fontWeight: 700,
                letterSpacing: "0.08em",
              },
            }}
          />

          <YAxis
            type="number"
            dataKey="impact"
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tick={{ fontSize: 11, fill: "#5e5e62", fontFamily: "var(--font-label), var(--font-sans), sans-serif" }}
            tickLine={false}
            axisLine={{ stroke: "rgba(26,28,32,0.12)" }}
            label={{
              value: "BUSINESS IMPACT",
              angle: -90,
              position: "insideLeft",
              offset: 4,
              style: {
                fontSize: 11,
                fill: "#5e5e62",
                fontFamily: "var(--font-label), var(--font-sans), sans-serif",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textAnchor: "middle",
              },
            }}
          />

          <Tooltip
            content={<CustomTooltipContent />}
            cursor={false}
            wrapperStyle={{ zIndex: 50 }}
          />

          <Scatter
            data={USE_CASES}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            shape={(props: any) => (
              <CustomDot {...props} activeId={activeId ?? undefined} />
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        </ScatterChart>
      </ResponsiveContainer>

      <figcaption className="ucm-caption">
        Hover or tap a point to see the rationale. Top-right quadrant represents
        the highest-priority use cases.
      </figcaption>
    </figure>
  );
}
