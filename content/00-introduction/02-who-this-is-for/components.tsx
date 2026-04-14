interface Segment {
  label: string;
  note: string;
  opacity: number;
  sweet?: boolean;
}

const SEGMENTS: Segment[] = [
  { label: "Startup", note: "5–50 people", opacity: 0.35 },
  { label: "Scale-up", note: "50–500", opacity: 0.6 },
  { label: "Mid-market", note: "500–5,000", sweet: true, opacity: 1 },
  { label: "Enterprise", note: "5,000–50,000", sweet: true, opacity: 1 },
  { label: "Fortune 100", note: "50,000+", opacity: 0.6 },
];

export function CompanySizeSpectrum() {
  return (
    <figure className="css-figure" role="img" aria-label="This guide's sweet spot is mid-market and enterprise organizations.">
      <div className="css-track">
        {SEGMENTS.map((seg) => (
          <div
            key={seg.label}
            className="css-segment"
            data-sweet={seg.sweet || undefined}
            style={{ opacity: seg.opacity }}
          >
            <div className="css-bar" />
            <div className="css-segment-label">{seg.label}</div>
            <div className="css-segment-note">{seg.note}</div>
          </div>
        ))}
      </div>
      <div className="css-bracket">
        <span className="css-bracket-line" />
        <span className="css-bracket-text">Guide sweet spot</span>
        <span className="css-bracket-line" />
      </div>
    </figure>
  );
}
