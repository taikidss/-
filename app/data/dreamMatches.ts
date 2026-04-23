export type DreamMatch = {
  id: string;
  category: "RIZIN" | "ONE" | "BOXING";
  fighter1: { name: string; country?: string };
  fighter2: { name: string; country?: string };
  weightClass: string;
  note?: string;
};

export const dreamMatches: DreamMatch[] = [
  // ── RIZIN ────────────────────────────────────────
  {
    id: "rizin-1",
    category: "RIZIN",
    fighter1: { name: "朝倉未来" },
    fighter2: { name: "平本蓮" },
    weightClass: "フェザー級",
    note: "最大のライバル対決",
  },
  {
    id: "rizin-2",
    category: "RIZIN",
    fighter1: { name: "堀口恭司" },
    fighter2: { name: "朝倉海" },
    weightClass: "バンタム級",
    note: "再戦",
  },
  {
    id: "rizin-3",
    category: "RIZIN",
    fighter1: { name: "鈴木千裕" },
    fighter2: { name: "ルイス・グスタボ", country: "🇧🇷" },
    weightClass: "フェザー級",
  },
  {
    id: "rizin-4",
    category: "RIZIN",
    fighter1: { name: "牛久絢太郎" },
    fighter2: { name: "クレベル・コイケ", country: "🇧🇷" },
    weightClass: "フェザー級",
  },
  {
    id: "rizin-5",
    category: "RIZIN",
    fighter1: { name: "斎藤裕" },
    fighter2: { name: "パトリシオ・ピットブル", country: "🇧🇷" },
    weightClass: "フェザー級",
    note: "世界最強決定戦",
  },
  {
    id: "rizin-6",
    category: "RIZIN",
    fighter1: { name: "萩原京平" },
    fighter2: { name: "弥益ドミネーター聡志" },
    weightClass: "ライト級",
  },
  {
    id: "rizin-7",
    category: "RIZIN",
    fighter1: { name: "朝倉未来" },
    fighter2: { name: "斎藤裕" },
    weightClass: "フェザー級",
  },
  // ── ONE Championship ─────────────────────────────
  {
    id: "one-1",
    category: "ONE",
    fighter1: { name: "中村倫也" },
    fighter2: { name: "ディミトリウス・ジョンソン", country: "🇺🇸" },
    weightClass: "フライ級",
    note: "フライ級最強決定",
  },
  {
    id: "one-2",
    category: "ONE",
    fighter1: { name: "青木真也" },
    fighter2: { name: "クリスチャン・リー", country: "🇺🇸" },
    weightClass: "ライト級",
  },
  {
    id: "one-3",
    category: "ONE",
    fighter1: { name: "秋山成勲" },
    fighter2: { name: "アンドレ・ガルバォン", country: "🇧🇷" },
    weightClass: "ミドル級",
  },
  {
    id: "one-4",
    category: "ONE",
    fighter1: { name: "若松佑弥" },
    fighter2: { name: "デメトリアス・ジョンソン", country: "🇺🇸" },
    weightClass: "ストロー級",
  },
  {
    id: "one-5",
    category: "ONE",
    fighter1: { name: "松嶋こよみ" },
    fighter2: { name: "タン・カイ", country: "🇨🇳" },
    weightClass: "フェザー級",
    note: "再戦要求",
  },
  {
    id: "one-6",
    category: "ONE",
    fighter1: { name: "石原夜叉坊" },
    fighter2: { name: "ナタン・シュルテ", country: "🇳🇱" },
    weightClass: "ヘビー級",
  },
  // ── BOXING ───────────────────────────────────────
  {
    id: "box-1",
    category: "BOXING",
    fighter1: { name: "井上尚弥" },
    fighter2: { name: "カネロ・アルバレス", country: "🇲🇽" },
    weightClass: "夢の異階級",
    note: "究極の夢",
  },
  {
    id: "box-2",
    category: "BOXING",
    fighter1: { name: "井上尚弥" },
    fighter2: { name: "ネイサン・マクキャロン", country: "🇦🇺" },
    weightClass: "スーパーバンタム級",
    note: "無敗の挑戦者",
  },
  {
    id: "box-3",
    category: "BOXING",
    fighter1: { name: "中谷潤人" },
    fighter2: { name: "ノルディーヌ・ウバーリ", country: "🇫🇷" },
    weightClass: "バンタム級",
  },
  {
    id: "box-4",
    category: "BOXING",
    fighter1: { name: "田中恒成" },
    fighter2: { name: "ファン・フランシスコ・エストラダ", country: "🇲🇽" },
    weightClass: "スーパーフライ級",
    note: "レジェンド対決",
  },
  {
    id: "box-5",
    category: "BOXING",
    fighter1: { name: "拳四朗" },
    fighter2: { name: "ゲーニー・ゴンサレス", country: "🇲🇽" },
    weightClass: "スーパーフライ級",
  },
  {
    id: "box-6",
    category: "BOXING",
    fighter1: { name: "中谷潤人" },
    fighter2: { name: "井上拓真" },
    weightClass: "バンタム級",
    note: "日本人対決",
  },
];
