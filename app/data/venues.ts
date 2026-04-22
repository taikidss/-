export type Section = {
  id: string;
  name: string;
  color: string;
};

export type Venue = {
  id: string;
  name: string;
  coverImage: string;
  seatMapUrl?: string;
  sections: Section[];
};

export const venues: Venue[] = [
  {
    id: "saitama-super-arena",
    name: "GMOアリーナさいたま（さいたまスーパーアリーナ）",
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Saitama_Super_Arena_02.jpg",
    sections: [
      { id: "vvip",      name: "VVIP席",    color: "#dc2626" },
      { id: "vip",       name: "VIP席",     color: "#ea580c" },
      { id: "srs",       name: "SRS席",     color: "#f97316" },
      { id: "level-200", name: "200レベル", color: "#3b82f6" },
      { id: "level-300", name: "300レベル", color: "#8b5cf6" },
      { id: "level-400", name: "400レベル", color: "#6366f1" },
      { id: "level-500", name: "500レベル", color: "#6b7280" },
    ],
  },
  {
    id: "tokyo-dome",
    name: "東京ドーム",
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/4/40/Tokyo_Dome_%2852480559907%29.jpg",
    sections: [
      { id: "arena-rs",    name: "アリーナRS席",      color: "#dc2626" },
      { id: "arena-ss",    name: "アリーナSS席",      color: "#ea580c" },
      { id: "arena-s",     name: "アリーナS席",       color: "#f97316" },
      { id: "naiya-box",   name: "内野指定BOX席",     color: "#eab308" },
      { id: "naiya-lower", name: "内野指定席下段",    color: "#22c55e" },
      { id: "balcony",     name: "バルコニーシート",  color: "#14b8a6" },
      { id: "naiya-upper", name: "内野指定席上段",    color: "#3b82f6" },
      { id: "second-box",  name: "2階BOX席",          color: "#8b5cf6" },
      { id: "second-std",  name: "2階指定席",         color: "#a855f7" },
      { id: "outfield",    name: "外野指定席",        color: "#6b7280" },
      { id: "wheelchair",  name: "車いす席",          color: "#ec4899" },
    ],
  },
  {
    id: "ariake-arena",
    name: "有明アリーナ",
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/0/02/Ariake_Arena.jpg",
    sections: [
      { id: "arena",    name: "アリーナ席",    color: "#ec4899" },
      { id: "stand-2f", name: "2階スタンド席", color: "#3b82f6" },
      { id: "stand-3f", name: "3階スタンド席", color: "#8b5cf6" },
      { id: "stand-4f", name: "4階スタンド席", color: "#6b7280" },
    ],
  },
  {
    id: "glion-arena-kobe",
    name: "GLION ARENA KOBE",
    coverImage: "https://msp.c.yimg.jp/images/v2/FUTi93tXq405grZVGgDqGz68sAGD1zBNMdl0xZaNos2GaqsNVswWRIaLwLk4rMCJDVOaH4ZHWo8EtG-Xnja3OivKwkgmxdD_VzFBS52Jl4QryBMx00y9A5-ADNeownqn1q01LXUKS0Cj1bpyjKzHDOTVvXREHo838CBd_Z1aQ46o9qRmCUf2nxsJ_ewKEINIlqQGyzf-7nCkCtXYRaaGDK9dg7h1x0qYt0r9HCtogMDkYSBdJZGB-kR1dVtesuR-SbbWRWLFIqJQl0OC8U_SLrtNckNdgT8MZhqY0q26KoNWaF9PSrJiZsQCfUJxcBwnJ9Lzf5thSi34i3l3i1YOjVc8eK6HcVsk6I3vCaXhWamFlOCConhaxde6zB9k7McqQqX8WoDMlbglnBDIPiTu5pY9DNSoH98pG7j_ej8hhJYKJUMxoyyc6fvyes5P0yzDcXAHE4V2ICKQoQvvWu991wqB9OQLzPgHLB-HhragQwDdnvjkgfYyfXK3eeVCQIh6fVuZ_3-D-uMwKx240tXeINQ3A0rL0kjq8_yvRtqm4fOCN-6Qs4fquPHG9TGGf-W4IidesDPABv4u9huUOuclbpPr1SI610GfseKFkC34tzu9EBnndpX0XKOGdDjeJzOpuyYGAhIUKjsYKt2opnwang==/134094-68-e8f94df2fcd0c6c74494f3809f9235bc-2880x1921.jpg?errorImage=false",
    sections: [
      { id: "vvip",          name: "VVIP席",         color: "#dc2626" },
      { id: "vip",           name: "VIP席",          color: "#ea580c" },
      { id: "srs",           name: "SRS席",          color: "#f97316" },
      { id: "s",             name: "S席",            color: "#eab308" },
      { id: "a",             name: "A席",            color: "#3b82f6" },
      { id: "sweet-lounge",  name: "スイートラウンジ席", color: "#8b5cf6" },
    ],
  },
];
