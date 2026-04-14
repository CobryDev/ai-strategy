"use client";

interface Stat {
  pct: number;
  label: string;
  source: string;
}

const STATS: Stat[] = [
  {
    pct: 42,
    label: "abandoned most AI initiatives",
    source: "S&P Global, 2025",
  },
  {
    pct: 50,
    label: "of PoCs scrapped before production",
    source: "S&P Global, 2025",
  },
  {
    pct: 95,
    label: "of gen AI pilots with no measurable impact",
    source: "MIT Sloan, 2025",
  },
];

function WaffleGrid({ pct }: { pct: number }) {
  const cells = Array.from({ length: 100 }, (_, i) => {
    const row = Math.floor(i / 10);
    const col = i % 10;
    const index = (9 - row) * 10 + col;
    const filled = index < pct;
    return (
      <span
        key={i}
        className="rg-cell"
        data-filled={filled || undefined}
      />
    );
  });

  return <div className="rg-grid">{cells}</div>;
}

export function RealityGap() {
  return (
    <figure className="rg-figure" role="img" aria-label="The Reality Gap: most enterprise AI efforts fail. 42% abandoned initiatives, 50% scrapped PoCs, 95% no measurable impact.">
      <div className="rg-title">The Reality Gap</div>
      <div className="rg-stats">
        {STATS.map((stat) => (
          <div key={stat.label} className="rg-stat">
            <WaffleGrid pct={stat.pct} />
            <div className="rg-meta">
              <div className="rg-pct">{stat.pct}%</div>
              <div className="rg-label">{stat.label}</div>
              <div className="rg-source">{stat.source}</div>
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}
