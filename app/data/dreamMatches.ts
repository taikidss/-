export type DreamMatch = {
  id: string;
  category: "RIZIN" | "ONE" | "BOXING";
  fighter1: { name: string; country?: string };
  fighter2: { name: string; country?: string };
  weightClass: string;
  note?: string;
};

export const dreamMatches: DreamMatch[] = [];
