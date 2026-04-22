export type MapSection = {
  sectionId: string;
  label: string;
  color: string;
  paths: string[];
  labelX?: number;
  labelY?: number;
  fillRule?: "nonzero" | "evenodd";
};

export type VenueMapDef = {
  venueId: string;
  viewBox: string;
  cx: number;
  cy: number;
  sections: MapSection[];
  ringPath: string;
  boundaryPath?: string;
};

const n = (v: number) => v.toFixed(1);

// ── SVGパスヘルパー ──────────────────────────────────────

// 扇形（内外2楕円の間の弧）
function wedgePath(
  cx: number, cy: number,
  irx: number, iry: number,
  orx: number, ory: number,
  startDeg: number, endDeg: number
): string {
  const r = (d: number) => (d * Math.PI) / 180;
  const s = r(startDeg), e = r(endDeg);
  const span = ((endDeg - startDeg) + 360) % 360;
  const la = span > 180 ? 1 : 0;
  return [
    `M ${n(cx + orx * Math.cos(s))},${n(cy + ory * Math.sin(s))}`,
    `A ${orx},${ory},0,${la},1,${n(cx + orx * Math.cos(e))},${n(cy + ory * Math.sin(e))}`,
    `L ${n(cx + irx * Math.cos(e))},${n(cy + iry * Math.sin(e))}`,
    `A ${irx},${iry},0,${la},0,${n(cx + irx * Math.cos(s))},${n(cy + iry * Math.sin(s))}`,
    "Z",
  ].join(" ");
}

// 360°ドーナツ（逆向き内円でhole）
function donutPath(
  cx: number, cy: number,
  orx: number, ory: number,
  irx: number, iry: number
): string {
  const outer = `M ${cx + orx} ${cy} A ${orx} ${ory} 0 1 1 ${cx - orx} ${cy} A ${orx} ${ory} 0 1 1 ${cx + orx} ${cy}`;
  const inner = `M ${cx + irx} ${cy} A ${irx} ${iry} 0 1 0 ${cx - irx} ${cy} A ${irx} ${iry} 0 1 0 ${cx + irx} ${cy}`;
  return `${outer} ${inner} Z`;
}

// 8角形（オクタゴン）
function octagonPath(cx: number, cy: number, rx: number, ry: number): string {
  const angles = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];
  const pts = angles.map((a) => {
    const rad = (a * Math.PI) / 180;
    return `${n(cx + rx * Math.cos(rad))},${n(cy + ry * Math.sin(rad))}`;
  });
  return `M ${pts.join(" L ")} Z`;
}

// 角丸矩形パス（時計回り）
function rectPath(cx: number, cy: number, w: number, h: number, r = 10): string {
  const x = cx - w / 2, y = cy - h / 2;
  return [
    `M ${n(x + r)} ${n(y)}`,
    `L ${n(x + w - r)} ${n(y)}`,
    `Q ${n(x + w)} ${n(y)} ${n(x + w)} ${n(y + r)}`,
    `L ${n(x + w)} ${n(y + h - r)}`,
    `Q ${n(x + w)} ${n(y + h)} ${n(x + w - r)} ${n(y + h)}`,
    `L ${n(x + r)} ${n(y + h)}`,
    `Q ${n(x)} ${n(y + h)} ${n(x)} ${n(y + h - r)}`,
    `L ${n(x)} ${n(y + r)}`,
    `Q ${n(x)} ${n(y)} ${n(x + r)} ${n(y)}`,
    "Z",
  ].join(" ");
}

// 矩形ドーナツ（evenodd fill で穴あき）
function rectDonut(
  cx: number, cy: number,
  ow: number, oh: number,
  iw: number, ih: number,
  or = 12, ir = 8
): string {
  return `${rectPath(cx, cy, ow, oh, or)} ${rectPath(cx, cy, iw, ih, ir)}`;
}

// ══════════════════════════════════════════════════════════
// GMOアリーナさいたま
// ══════════════════════════════════════════════════════════
const SSA_CX = 300, SSA_CY = 238;
const SSA_RX = 52, SSA_RY = 42;  // リング

const saitamaMap: VenueMapDef = {
  venueId: "saitama-super-arena",
  viewBox: "0 0 600 476",
  cx: SSA_CX,
  cy: SSA_CY,
  ringPath: octagonPath(SSA_CX, SSA_CY, SSA_RX, SSA_RY),
  boundaryPath: `M ${SSA_CX + 282} ${SSA_CY} A 282 226 0 1 1 ${SSA_CX - 282} ${SSA_CY} A 282 226 0 1 1 ${SSA_CX + 282} ${SSA_CY} Z`,
  sections: [
    {
      sectionId: "vvip",
      label: "VVIP",
      color: "#dc2626",
      paths: [donutPath(SSA_CX, SSA_CY, 74, 59, SSA_RX, SSA_RY)],
      labelX: SSA_CX, labelY: SSA_CY - 64,
    },
    {
      sectionId: "vip",
      label: "VIP",
      color: "#ea580c",
      paths: [donutPath(SSA_CX, SSA_CY, 98, 78, 74, 59)],
      labelX: SSA_CX, labelY: SSA_CY - 86,
    },
    {
      sectionId: "srs",
      label: "SRS",
      color: "#f97316",
      paths: [donutPath(SSA_CX, SSA_CY, 124, 99, 98, 78)],
      labelX: SSA_CX, labelY: SSA_CY - 110,
    },
    {
      sectionId: "level-200",
      label: "200",
      color: "#3b82f6",
      paths: [donutPath(SSA_CX, SSA_CY, 168, 134, 124, 99)],
      labelX: SSA_CX, labelY: SSA_CY - 149,
    },
    {
      sectionId: "level-300",
      label: "300",
      color: "#8b5cf6",
      paths: [donutPath(SSA_CX, SSA_CY, 184, 147, 168, 134)],
      labelX: SSA_CX, labelY: SSA_CY - 177,
    },
    {
      sectionId: "level-400",
      label: "400",
      color: "#6366f1",
      paths: [donutPath(SSA_CX, SSA_CY, 228, 182, 184, 147)],
      labelX: SSA_CX, labelY: SSA_CY - 205,
    },
    {
      sectionId: "level-500",
      label: "500",
      color: "#94a3b8",
      paths: [donutPath(SSA_CX, SSA_CY, 264, 211, 228, 182)],
      labelX: SSA_CX, labelY: SSA_CY - 240,
    },
  ],
};

// ══════════════════════════════════════════════════════════
// 東京ドーム
// ══════════════════════════════════════════════════════════
const TD_CX = 300, TD_CY = 238;
const TD_RX = 52, TD_RY = 42;

// 各層 [iRx, iRy, oRx, oRy]
const TDL = {
  rs:     [TD_RX, TD_RY,  72,  58],
  ss:     [72,   58,   96,  77],
  s:      [96,   77,  120,  96],
  nBox:   [120,  96,  144, 115],
  nLower: [144, 115,  168, 134],
  balc:   [168, 134,  182, 146],
  nUpper: [182, 146,  210, 168],
  sec2f:  [210, 168,  244, 195],
} as const;

// 内野 310°→230°（280°弧）、外野 230°→310°（80°弧）
const INF_S = 310, INF_E = 230;
const OF_S = 230, OF_E = 310;

function tdW(l: readonly [number, number, number, number], s: number, e: number) {
  return wedgePath(TD_CX, TD_CY, l[0], l[1], l[2], l[3], s, e);
}

const tokyoDomeMap: VenueMapDef = {
  venueId: "tokyo-dome",
  viewBox: "0 0 600 476",
  cx: TD_CX,
  cy: TD_CY,
  ringPath: octagonPath(TD_CX, TD_CY, TD_RX, TD_RY),
  // ドーム外形（ほぼ円形）
  boundaryPath: `M ${TD_CX + 268} ${TD_CY} A 268 268 0 1 1 ${TD_CX - 268} ${TD_CY} A 268 268 0 1 1 ${TD_CX + 268} ${TD_CY} Z`,
  sections: [
    {
      sectionId: "arena-rs",
      label: "アリーナRS",
      color: "#dc2626",
      paths: [donutPath(TD_CX, TD_CY, TDL.rs[2], TDL.rs[3], TDL.rs[0], TDL.rs[1])],
      labelX: TD_CX, labelY: TD_CY - 63,
    },
    {
      sectionId: "arena-ss",
      label: "アリーナSS",
      color: "#ea580c",
      paths: [donutPath(TD_CX, TD_CY, TDL.ss[2], TDL.ss[3], TDL.ss[0], TDL.ss[1])],
      labelX: TD_CX, labelY: TD_CY - 85,
    },
    {
      sectionId: "arena-s",
      label: "アリーナS",
      color: "#f97316",
      paths: [donutPath(TD_CX, TD_CY, TDL.s[2], TDL.s[3], TDL.s[0], TDL.s[1])],
      labelX: TD_CX, labelY: TD_CY - 107,
    },
    {
      sectionId: "naiya-box",
      label: "内野BOX",
      color: "#eab308",
      paths: [tdW(TDL.nBox, INF_S, INF_E)],
      labelX: TD_CX - 158, labelY: TD_CY,
    },
    {
      sectionId: "naiya-lower",
      label: "内野下段",
      color: "#22c55e",
      paths: [tdW(TDL.nLower, INF_S, INF_E)],
      labelX: TD_CX - 182, labelY: TD_CY,
    },
    {
      sectionId: "balcony",
      label: "バルコニー",
      color: "#14b8a6",
      paths: [tdW(TDL.balc, INF_S, INF_E)],
      labelX: TD_CX - 196, labelY: TD_CY - 20,
    },
    {
      sectionId: "naiya-upper",
      label: "内野上段",
      color: "#3b82f6",
      paths: [tdW(TDL.nUpper, INF_S, INF_E)],
      labelX: TD_CX - 214, labelY: TD_CY - 80,
    },
    {
      sectionId: "second-box",
      label: "2階BOX",
      color: "#8b5cf6",
      paths: [tdW(TDL.sec2f, 50, 130)],
      labelX: TD_CX, labelY: TD_CY + 218,
    },
    {
      sectionId: "second-std",
      label: "2階指定",
      color: "#a855f7",
      paths: [
        tdW(TDL.sec2f, INF_S, 50),
        tdW(TDL.sec2f, 130, INF_E),
      ],
      labelX: TD_CX - 234, labelY: TD_CY - 150,
    },
    {
      sectionId: "outfield",
      label: "外野",
      color: "#6b7280",
      paths: [wedgePath(TD_CX, TD_CY, TDL.nBox[0], TDL.nBox[1], TDL.sec2f[2], TDL.sec2f[3], OF_S, OF_E)],
      labelX: TD_CX, labelY: TD_CY - 220,
    },
    {
      sectionId: "wheelchair",
      label: "車いす",
      color: "#ec4899",
      paths: [wedgePath(TD_CX, TD_CY, TDL.nLower[0], TDL.nLower[1], TDL.nUpper[2], TDL.nUpper[3], 295, 315)],
    },
  ],
};

// ══════════════════════════════════════════════════════════
// 有明アリーナ（矩形レイアウト）
// ══════════════════════════════════════════════════════════
const AA_CX = 300, AA_CY = 232;
const AA_RX = 50, AA_RY = 40;

// 各層の矩形サイズ [w, h]
const AAL = {
  arena:  [236, 177] as [number, number],
  stand2: [360, 270] as [number, number],
  stand3: [440, 330] as [number, number],
  stand4: [520, 390] as [number, number],
};

const ariakeMap: VenueMapDef = {
  venueId: "ariake-arena",
  viewBox: "0 0 600 464",
  cx: AA_CX,
  cy: AA_CY,
  ringPath: octagonPath(AA_CX, AA_CY, AA_RX, AA_RY),
  boundaryPath: rectPath(AA_CX, AA_CY, 540, 410, 20),
  sections: [
    {
      sectionId: "arena",
      label: "アリーナ",
      color: "#ec4899",
      // 矩形ドーナツ（外矩形 − オクタゴン）
      paths: [`${rectPath(AA_CX, AA_CY, AAL.arena[0], AAL.arena[1], 14)} ${octagonPath(AA_CX, AA_CY, AA_RX, AA_RY)}`],
      fillRule: "evenodd",
      labelX: AA_CX, labelY: AA_CY - AAL.arena[1] / 2 + 14,
    },
    {
      sectionId: "stand-2f",
      label: "2F スタンド",
      color: "#3b82f6",
      paths: [rectDonut(AA_CX, AA_CY, AAL.stand2[0], AAL.stand2[1], AAL.arena[0], AAL.arena[1], 16, 14)],
      fillRule: "evenodd",
      labelX: AA_CX, labelY: AA_CY - AAL.stand2[1] / 2 + 14,
    },
    {
      sectionId: "stand-3f",
      label: "3F",
      color: "#8b5cf6",
      // 北側と南側の帯のみ
      paths: [
        // 北帯（上）
        `M ${n(AA_CX - AAL.stand3[0] / 2)} ${n(AA_CY - AAL.stand3[1] / 2)} ` +
        `L ${n(AA_CX + AAL.stand3[0] / 2)} ${n(AA_CY - AAL.stand3[1] / 2)} ` +
        `L ${n(AA_CX + AAL.stand3[0] / 2)} ${n(AA_CY - AAL.stand2[1] / 2)} ` +
        `L ${n(AA_CX - AAL.stand3[0] / 2)} ${n(AA_CY - AAL.stand2[1] / 2)} Z`,
        // 南帯（下）
        `M ${n(AA_CX - AAL.stand3[0] / 2)} ${n(AA_CY + AAL.stand2[1] / 2)} ` +
        `L ${n(AA_CX + AAL.stand3[0] / 2)} ${n(AA_CY + AAL.stand2[1] / 2)} ` +
        `L ${n(AA_CX + AAL.stand3[0] / 2)} ${n(AA_CY + AAL.stand3[1] / 2)} ` +
        `L ${n(AA_CX - AAL.stand3[0] / 2)} ${n(AA_CY + AAL.stand3[1] / 2)} Z`,
      ],
      labelX: AA_CX, labelY: AA_CY - AAL.stand3[1] / 2 + 14,
    },
    {
      sectionId: "stand-4f",
      label: "4F スタンド",
      color: "#94a3b8",
      paths: [rectDonut(AA_CX, AA_CY, AAL.stand4[0], AAL.stand4[1], AAL.stand3[0], AAL.stand3[1], 20, 16)],
      fillRule: "evenodd",
      labelX: AA_CX, labelY: AA_CY - AAL.stand4[1] / 2 + 14,
    },
  ],
};

// ══════════════════════════════════════════════════════════
// GLION ARENA KOBE
// ══════════════════════════════════════════════════════════
const GAK_CX = 300, GAK_CY = 238;
const GAK_RX = 48, GAK_RY = 38;

const glionArenaMap: VenueMapDef = {
  venueId: "glion-arena-kobe",
  viewBox: "0 0 600 476",
  cx: GAK_CX,
  cy: GAK_CY,
  ringPath: octagonPath(GAK_CX, GAK_CY, GAK_RX, GAK_RY),
  boundaryPath: `M ${GAK_CX + 262} ${GAK_CY} A 262 210 0 1 1 ${GAK_CX - 262} ${GAK_CY} A 262 210 0 1 1 ${GAK_CX + 262} ${GAK_CY} Z`,
  sections: [
    {
      sectionId: "vvip",
      label: "VVIP",
      color: "#dc2626",
      paths: [donutPath(GAK_CX, GAK_CY, 70, 56, GAK_RX, GAK_RY)],
      labelX: GAK_CX, labelY: GAK_CY - 62,
    },
    {
      sectionId: "vip",
      label: "VIP",
      color: "#ea580c",
      paths: [donutPath(GAK_CX, GAK_CY, 92, 74, 70, 56)],
      labelX: GAK_CX, labelY: GAK_CY - 81,
    },
    {
      sectionId: "srs",
      label: "SRS",
      color: "#f97316",
      paths: [donutPath(GAK_CX, GAK_CY, 116, 93, 92, 74)],
      labelX: GAK_CX, labelY: GAK_CY - 103,
    },
    {
      sectionId: "s",
      label: "S席",
      color: "#eab308",
      // 3方向（スイートラウンジ側=南を除く）
      paths: [wedgePath(GAK_CX, GAK_CY, 116, 93, 170, 136, 310, 130)],
      labelX: GAK_CX, labelY: GAK_CY - 148,
    },
    {
      sectionId: "a",
      label: "A席",
      color: "#3b82f6",
      paths: [wedgePath(GAK_CX, GAK_CY, 170, 136, 220, 176, 310, 130)],
      labelX: GAK_CX, labelY: GAK_CY - 196,
    },
    {
      sectionId: "sweet-lounge",
      label: "スイート",
      color: "#8b5cf6",
      // 南側（下）エンド専用エリア
      paths: [wedgePath(GAK_CX, GAK_CY, 116, 93, 220, 176, 130, 230)],
      labelX: GAK_CX + 40, labelY: GAK_CY + 170,
    },
  ],
};

export const venueMaps: Record<string, VenueMapDef> = {
  "saitama-super-arena": saitamaMap,
  "tokyo-dome": tokyoDomeMap,
  "ariake-arena": ariakeMap,
  "glion-arena-kobe": glionArenaMap,
};
