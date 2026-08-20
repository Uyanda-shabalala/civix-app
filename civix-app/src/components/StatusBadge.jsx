const STATUS_STYLES = {
  new: { label: "New", bg: "#e7edfc", color: "#2549b3" },
  acknowledged: { label: "Acknowledged", bg: "#eef3ff", color: "#2549b3" },
  in_progress: { label: "In Progress", bg: "var(--color-brand-amber-bg)", color: "var(--color-brand-amber)" },
  overdue: { label: "Overdue", bg: "var(--color-brand-red-bg)", color: "var(--color-brand-red)" },
  resolved: { label: "Resolved", bg: "var(--color-brand-green-bg)", color: "var(--color-brand-green)" },
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.new;
  return (
    <span className="status-badge" style={{ background: style.bg, color: style.color }}>
      {style.label}
    </span>
  );
}
