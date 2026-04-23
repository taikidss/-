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
    weightClass: "フェザー級 66kg",
    note: "最大のライバル対決",
  },
  {
    id: "rizin-2",
    category: "RIZIN",
    fighter1: { name: "鈴木千裕" },
    fighter2: { name: "ラジャブアリ・シェイドゥラエフ", country: "🇷🇺" },
    weightClass: "フェザー級 66kg",
    note: "王座挑戦",
  },
  {
    id: "rizin-3",
    category: "RIZIN",
    fighter1: { name: "堀口恭司" },
    fighter2: { name: "朝倉海" },
    weightClass: "バンタム級 61kg",
    note: "再戦熱望",
  },
  {
    id: "rizin-4",
    category: "RIZIN",
    fighter1: { name: "朝倉未来" },
    fighter2: { name: "ラジャブアリ・シェイドゥラエフ", country: "🇷🇺" },
    weightClass: "フェザー級 66kg",
    note: "タイトルマッチ再戦",
  },
  {
    id: "rizin-5",
    category: "RIZIN",
    fighter1: { name: "斎藤裕" },
    fighter2: { name: "パトリシオ・ピットブル", country: "🇧🇷" },
    weightClass: "フェザー級 66kg",
    note: "日米ブラジル最強決定",
  },
  {
    id: "rizin-6",
    category: "RIZIN",
    fighter1: { name: "萩原京平" },
    fighter2: { name: "イルホム・ノジモフ", country: "🇺🇿" },
    weightClass: "ライト級 70kg",
    note: "タイトル挑戦",
  },
  {
    id: "rizin-7",
    category: "RIZIN",
    fighter1: { name: "牛久絢太郎" },
    fighter2: { name: "クレベル・コイケ", country: "🇧🇷" },
    weightClass: "フェザー級 66kg",
  },

  // ── ONE Championship ─────────────────────────────
  {
    id: "one-1",
    category: "ONE",
    fighter1: { name: "若松佑弥" },
    fighter2: { name: "ディミトリウス・ジョンソン", country: "🇺🇸" },
    weightClass: "フライ級MMA",
    note: "王座統一・最強決定",
  },
  {
    id: "one-2",
    category: "ONE",
    fighter1: { name: "武尊" },
    fighter2: { name: "スーパーボン・シンハマウィン", country: "🇹🇭" },
    weightClass: "ライト級キックボクシング",
    note: "K-1 vs ムエタイ夢の対決",
  },
  {
    id: "one-3",
    category: "ONE",
    fighter1: { name: "松嶋こよみ" },
    fighter2: { name: "タン・カイ", country: "🇨🇳" },
    weightClass: "フェザー級MMA",
    note: "再戦要求",
  },
  {
    id: "one-4",
    category: "ONE",
    fighter1: { name: "吉成名高" },
    fighter2: { name: "スタンプ・フェアテックス", country: "🇹🇭" },
    weightClass: "アトム級ムエタイ",
    note: "再戦・王座奪還",
  },
  {
    id: "one-5",
    category: "ONE",
    fighter1: { name: "海人" },
    fighter2: { name: "ロッタン・ジットムアンノン", country: "🇹🇭" },
    weightClass: "ストロー級ムエタイ",
    note: "世界最高峰のムエタイ",
  },
  {
    id: "one-6",
    category: "ONE",
    fighter1: { name: "青木真也" },
    fighter2: { name: "クリスチャン・リー", country: "🇺🇸" },
    weightClass: "ライト級MMA",
    note: "伝説の再戦",
  },

  // ── BOXING ───────────────────────────────────────
  {
    id: "box-1",
    category: "BOXING",
    fighter1: { name: "井上尚弥" },
    fighter2: { name: "カネロ・アルバレス", country: "🇲🇽" },
    weightClass: "夢の異階級対決",
    note: "世界最高峰の夢",
  },
  {
    id: "box-2",
    category: "BOXING",
    fighter1: { name: "中谷潤人" },
    fighter2: { name: "ノルディーヌ・ウバーリ", country: "🇫🇷" },
    weightClass: "スーパーバンタム級",
    note: "無敗対決",
  },
  {
    id: "box-3",
    category: "BOXING",
    fighter1: { name: "寺地拳四朗" },
    fighter2: { name: "ゲーニー・ゴンサレス", country: "🇲🇽" },
    weightClass: "スーパーフライ級",
    note: "王座奪還への道",
  },
  {
    id: "box-4",
    category: "BOXING",
    fighter1: { name: "田中恒成" },
    fighter2: { name: "ファン・フランシスコ・エストラダ", country: "🇲🇽" },
    weightClass: "スーパーフライ級",
    note: "4階級制覇への挑戦",
  },
  {
    id: "box-5",
    category: "BOXING",
    fighter1: { name: "井上拓真" },
    fighter2: { name: "岩佐亮佑" },
    weightClass: "バンタム級",
    note: "日本人頂上決戦",
  },
  {
    id: "box-6",
    category: "BOXING",
    fighter1: { name: "井上尚弥" },
    fighter2: { name: "ネイサン・マクキャロン", country: "🇦🇺" },
    weightClass: "スーパーバンタム級",
    note: "無敗の挑戦者",
  },
];
