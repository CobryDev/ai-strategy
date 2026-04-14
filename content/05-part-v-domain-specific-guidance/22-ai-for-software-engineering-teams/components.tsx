"use client";

interface Metric {
  label: string;
  value: string;
  side: "gain" | "cost";
}

const METRICS: Metric[] = [
  { label: "Coding speed", value: "+29%", side: "gain" },
  { label: "Tasks completed", value: "More PRs/day", side: "gain" },
  { label: "Code checked in (2022→2025)", value: "+75%", side: "gain" },
  { label: "Code review time", value: "+47%", side: "cost" },
  { label: "Static analysis warnings", value: "+30%", side: "cost" },
  { label: "Code complexity", value: "+41%", side: "cost" },
  { label: "Technical debt", value: "Up to 4.94×", side: "cost" },
  { label: "Security vulnerabilities", value: "45% of output", side: "cost" },
];

export function CodeParadox() {
  const gains = METRICS.filter((m) => m.side === "gain");
  const costs = METRICS.filter((m) => m.side === "cost");

  return (
    <figure
      className="cp-figure"
      role="img"
      aria-label="The AI coding paradox: speed gains on one side, review burden, complexity, and security costs on the other."
    >
      <div className="cp-header">
        <span className="cp-suptitle">The productivity paradox</span>
        <span className="cp-subtitle">More code ≠ more productivity</span>
      </div>

      <div className="cp-scale">
        <div className="cp-side cp-side-gain">
          <div className="cp-side-label">What goes up</div>
          {gains.map((m) => (
            <div key={m.label} className="cp-metric">
              <span className="cp-metric-value">{m.value}</span>
              <span className="cp-metric-label">{m.label}</span>
            </div>
          ))}
        </div>

        <div className="cp-divider">
          <span className="cp-divider-line" />
          <span className="cp-divider-label">but also</span>
          <span className="cp-divider-line" />
        </div>

        <div className="cp-side cp-side-cost">
          <div className="cp-side-label">What goes up with it</div>
          {costs.map((m) => (
            <div key={m.label} className="cp-metric">
              <span className="cp-metric-value">{m.value}</span>
              <span className="cp-metric-label">{m.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="cp-takeaway">
        If your measurement system counts lines produced as productivity, AI looks like a miracle.
        If it counts working, secure, maintainable software delivered to users, the picture is more complicated.
      </div>
    </figure>
  );
}
