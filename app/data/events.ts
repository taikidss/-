export type MartialArtsEvent = {
  id: string;
  venueId: string;
  name: string;
  date: string; // YYYY-MM-DD
  promoter: string;
  url?: string;
  posterUrl?: string;
  posterPosition?: string;
};

export const events: MartialArtsEvent[] = [
  // ── 東京ドーム ──────────────────────────────
  {
    id: "td-rizin-2025",
    venueId: "tokyo-dome",
    name: "RIZIN 男祭り",
    date: "2025-05-04",
    promoter: "RIZIN FF",
    url: "https://jp.rizinff.com",
  },
  {
    id: "td-inoue-2026",
    venueId: "tokyo-dome",
    name: "井上尚弥 vs 中谷潤人",
    date: "2026-05-02",
    promoter: "ボクシング",
    posterUrl: "https://boxingnews.jp/wp-content/uploads/2026/03/THE-DAY.jpeg",
  },

  // ── さいたまスーパーアリーナ ─────────────────
  {
    id: "ssa-rizin-2025",
    venueId: "saitama-super-arena",
    name: "RIZIN 師走の超強者祭り",
    date: "2025-12-31",
    promoter: "RIZIN FF",
    url: "https://jp.rizinff.com",
  },

  // ── 有明アリーナ ─────────────────────────────
  {
    id: "aa-rizin-52",
    venueId: "ariake-arena",
    name: "RIZIN.52",
    date: "2026-03-07",
    promoter: "RIZIN FF",
    url: "https://jp.rizinff.com",
  },
  {
    id: "aa-one-2026",
    venueId: "ariake-arena",
    name: "ONE SAMURAI 1",
    date: "2026-04-29",
    promoter: "ONE Championship",
    url: "https://www.onefc.com",
    posterUrl: "https://cdn.onefc.com/wp-content/uploads/2025/11/260429-ONESamurai1-1800x1200px-1.jpg",
  },

  // ── GLION ARENA KOBE ─────────────────────────
  {
    id: "gak-rizin-53",
    venueId: "glion-arena-kobe",
    name: "RIZIN.53",
    date: "2026-05-10",
    promoter: "RIZIN FF",
    url: "https://jp.rizinff.com",
    posterUrl: "https://d1uzk9o9cg136f.cloudfront.net/f/16782696/rc/2026/04/15/2acc5b19331dcc666a30f1b695a722e70a5c50cb_large.jpg",
    posterPosition: "center top",
  },
];

export function getUpcomingEvents(venueId: string, today = new Date()): MartialArtsEvent[] {
  return events
    .filter((e) => e.venueId === venueId && new Date(e.date) >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getPastEvents(venueId: string, today = new Date()): MartialArtsEvent[] {
  return events
    .filter((e) => e.venueId === venueId && new Date(e.date) < today)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export function daysUntil(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
