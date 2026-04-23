import fs from "fs";
import path from "path";

const PICKS_FILE = path.join(process.cwd(), "data", "picks.json");

export type PickEntry = {
  eventId: string;
  fightIndex: number;
  red: number;
  blue: number;
};

export function readPicks(): PickEntry[] {
  try {
    return JSON.parse(fs.readFileSync(PICKS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

export function addPick(eventId: string, fightIndex: number, corner: "red" | "blue"): PickEntry {
  const picks = readPicks();
  let entry = picks.find((p) => p.eventId === eventId && p.fightIndex === fightIndex);
  if (!entry) {
    entry = { eventId, fightIndex, red: 0, blue: 0 };
    picks.push(entry);
  }
  entry[corner]++;
  fs.writeFileSync(PICKS_FILE, JSON.stringify(picks, null, 2));
  return entry;
}
