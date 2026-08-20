export const CATEGORIES = [
  { value: "pothole", label: "Pothole", icon: "🕳️" },
  { value: "water_leak", label: "Water Leak", icon: "💧" },
  { value: "power_outage", label: "Power Outage", icon: "⚡" },
  { value: "illegal_dumping", label: "Illegal Dumping", icon: "🗑️" },
  { value: "street_light", label: "Street Light", icon: "💡" },
  { value: "other", label: "Other", icon: "✏️" },
];

export function categoryMeta(value) {
  return CATEGORIES.find((c) => c.value === value) ?? CATEGORIES[CATEGORIES.length - 1];
}
