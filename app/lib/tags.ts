export const SEAT_TAGS = [
  { id: "pillar",     label: "柱・遮蔽物あり",   emoji: "🚧" },
  { id: "cutoff",     label: "リングが見切れる", emoji: "⚠️" },
  { id: "steep",      label: "傾斜がきつい",     emoji: "📐" },
  { id: "aisle",      label: "通路近く",         emoji: "🚶" },
  { id: "monitor",    label: "モニター見やすい", emoji: "📺" },
  { id: "great-view", label: "見晴らし良好",     emoji: "✨" },
] as const;

export type TagId = typeof SEAT_TAGS[number]["id"];
