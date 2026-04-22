export type Fighter = {
  name: string;
  country?: string;
};

export type Fight = {
  redCorner: Fighter;
  blueCorner: Fighter;
  weightClass: string;
  rule: string;
  rounds?: string;
  isMain?: boolean;
  isTitleMatch?: boolean;
  titleName?: string;
  note?: string;
};

export type FightCard = {
  eventId: string;
  fights: Fight[];
};

export const fightCards: FightCard[] = [
  // ── ONE SAMURAI 1（2026-04-29 有明アリーナ）────────────────
  {
    eventId: "aa-one-2026",
    fights: [
      {
        redCorner: { name: "ロッタン・ジットムアンノン", country: "🇹🇭" },
        blueCorner: { name: "武尊", country: "🇯🇵" },
        weightClass: "フライ級",
        rule: "キックボクシング",
        rounds: "3R",
        isMain: true,
        isTitleMatch: true,
        titleName: "暫定世界フライ級キックボクシング王座",
        note: "武尊の引退試合",
      },
      {
        redCorner: { name: "若松佑弥", country: "🇯🇵" },
        blueCorner: { name: "アヴァズベク・ホルミルザエフ", country: "🇺🇿" },
        weightClass: "フライ級",
        rule: "MMA",
        rounds: "5R",
        isTitleMatch: true,
        titleName: "世界フライ級MMA王座",
      },
      {
        redCorner: { name: "ジョナサン・ハガティ", country: "🇬🇧" },
        blueCorner: { name: "陽翔勇気", country: "🇯🇵" },
        weightClass: "バンタム級",
        rule: "キックボクシング",
        rounds: "3R",
        isTitleMatch: true,
        titleName: "世界バンタム級キックボクシング王座",
      },
      {
        redCorner: { name: "ナダカ", country: "🇯🇵" },
        blueCorner: { name: "ソンチャイノイ・キアットソングリット", country: "🇹🇭" },
        weightClass: "アトム級",
        rule: "ムエタイ",
        rounds: "3R",
        isTitleMatch: true,
        titleName: "世界アトム級ムエタイ王座",
      },
    ],
  },

  // ── 井上尚弥 vs 中谷潤人（2026-05-02 東京ドーム）──────────
  {
    eventId: "td-inoue-2026",
    fights: [
      {
        redCorner: { name: "井上尚弥", country: "🇯🇵" },
        blueCorner: { name: "中谷潤人", country: "🇯🇵" },
        weightClass: "スーパーバンタム級",
        rule: "ボクシング",
        rounds: "12R",
        isMain: true,
        isTitleMatch: true,
        titleName: "WBA/WBC/IBF/WBO 4団体統一スーパーバンタム級王座",
      },
      {
        redCorner: { name: "井上拓真", country: "🇯🇵" },
        blueCorner: { name: "井岡一翔", country: "🇯🇵" },
        weightClass: "バンタム級",
        rule: "ボクシング",
        rounds: "12R",
        isTitleMatch: true,
        titleName: "WBC世界バンタム級王座",
      },
      {
        redCorner: { name: "武居由樹", country: "🇯🇵" },
        blueCorner: { name: "ワン・デカン", country: "🇨🇳" },
        weightClass: "スーパーバンタム級",
        rule: "ボクシング",
        rounds: "8R",
      },
    ],
  },

  // ── RIZIN.53（2026-05-10 GLION ARENA KOBE）───────────────
  {
    eventId: "gak-rizin-53",
    fights: [
      {
        redCorner: { name: "イルホム・ノジモフ", country: "🇺🇿" },
        blueCorner: { name: "ルイス・グスタボ", country: "🇧🇷" },
        weightClass: "ライト級（71.0kg）",
        rule: "MMA",
        rounds: "5分3R",
        isMain: true,
        isTitleMatch: true,
        titleName: "RIZINライト級王座",
      },
      {
        redCorner: { name: "太田忍", country: "🇯🇵" },
        blueCorner: { name: "金太郎", country: "🇯🇵" },
        weightClass: "61.0kg",
        rule: "MMA",
        rounds: "5分3R",
      },
      {
        redCorner: { name: "高木凌", country: "🇯🇵" },
        blueCorner: { name: "リー・カイウェン", country: "🇨🇳" },
        weightClass: "66.0kg",
        rule: "MMA",
        rounds: "5分3R",
      },
      {
        redCorner: { name: "松嶋こよみ", country: "🇯🇵" },
        blueCorner: { name: "ライアン・カファロ", country: "🇺🇸" },
        weightClass: "66.0kg",
        rule: "MMA",
        rounds: "5分3R",
      },
      {
        redCorner: { name: "平本蓮", country: "🇯🇵" },
        blueCorner: { name: "皇治", country: "🇯🇵" },
        weightClass: "無差別級",
        rule: "スタンディングバウト",
        rounds: "3分3R",
      },
    ],
  },
];

export function getFightCard(eventId: string): FightCard | undefined {
  return fightCards.find((c) => c.eventId === eventId);
}
