const LEGEND_ITEMS = [
  { type: "important", icon: "◇", label: "Important", desc: "Important or often overlooked tip" },
  { type: "danger", icon: "⚠", label: "Danger", desc: "Serious warning or pitfall where risks or costs are significant" },
  { type: "caution", icon: "◇", label: "Caution", desc: "Caution, limitation, or problem" },
  { type: "controversy", icon: "📣", label: "Controversy", desc: "Controversial topic where informed opinion varies significantly" },
  { type: "confusion", icon: "🤷", label: "Confusion", desc: "Common confusion or misunderstanding, such as confusing terminology" },
  { type: "new", icon: "🆕", label: "New", desc: "New or recent developments" },
  { type: "contribute", icon: "✏️", label: "Contribute", desc: "Reader contribution solicited" },
  { type: "story", icon: "💬", label: "Story", desc: "A personal anecdote or story" },
];

export function CalloutLegend() {
  return (
    <div className="callout-legend">
      <h2>Legend</h2>
      <div className="callout-legend-list">
        {LEGEND_ITEMS.map(({ type, icon, label, desc }) => (
          <div key={type} className="callout-legend-item">
            <span className="callout-legend-badge" data-type={type}>
              <span className="callout-legend-badge-icon">{icon}</span>
              {label}
            </span>
            <span className="callout-legend-desc">{desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
