"use client";

import { useState, useEffect } from "react";
import type { Fight } from "../data/fightCards";

interface PickEntry {
  fightIndex: number;
  red: number;
  blue: number;
}

interface Props {
  eventId: string;
  fights: Fight[];
  isPast: boolean;
}

export default function FightPicks({ eventId, fights, isPast }: Props) {
  const storageKey = `picks-${eventId}`;
  const [picks, setPicks] = useState<Record<number, "red" | "blue">>({});
  const [counts, setCounts] = useState<PickEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setPicks(JSON.parse(saved));
    fetch(`/api/picks?eventId=${eventId}`)
      .then((r) => r.json())
      .then((data) => { setCounts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [eventId, storageKey]);

  async function handlePick(fightIndex: number, corner: "red" | "blue") {
    if (picks[fightIndex] || isPast) return;
    const res = await fetch("/api/picks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, fightIndex, corner }),
    });
    const entry = await res.json();
    const newPicks = { ...picks, [fightIndex]: corner };
    setPicks(newPicks);
    localStorage.setItem(storageKey, JSON.stringify(newPicks));
    setCounts((prev) => {
      const next = prev.filter((p) => p.fightIndex !== fightIndex);
      return [...next, { fightIndex, red: entry.red, blue: entry.blue }];
    });
  }

  return (
    <div className="flex flex-col gap-3 mt-6">
      <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">
        {isPast ? "みんなの予想結果" : "勝者を予想する"}
      </h2>
      <div className="flex flex-col gap-2">
        {fights.map((fight, i) => {
          const myPick = picks[i];
          const count = counts.find((c) => c.fightIndex === i);
          const total = (count?.red ?? 0) + (count?.blue ?? 0);
          const redPct = total > 0 ? Math.round(((count?.red ?? 0) / total) * 100) : 50;
          const bluePct = total > 0 ? 100 - redPct : 50;
          const showResult = !!myPick || isPast;

          return (
            <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900 p-3 sm:p-4">
              <div className="flex items-center justify-between gap-2 mb-3 text-xs text-zinc-500">
                <span>{fight.weightClass} · {fight.rule}</span>
                {total > 0 && <span>{total}票</span>}
              </div>

              <div className="flex items-center gap-2">
                {/* 赤コーナー */}
                <button
                  onClick={() => handlePick(i, "red")}
                  disabled={!!myPick || isPast}
                  className={`flex-1 rounded-lg border py-2 px-2 text-xs sm:text-sm font-bold transition-all text-left ${
                    myPick === "red"
                      ? "border-red-500 bg-red-500/20 text-red-300"
                      : myPick || isPast
                      ? "border-zinc-700 bg-zinc-800 text-zinc-500 cursor-default"
                      : "border-zinc-700 bg-zinc-800 text-white hover:border-red-500/50 hover:bg-red-950/30 cursor-pointer"
                  }`}
                >
                  <span className="block truncate">
                    {fight.redCorner.country} {fight.redCorner.name}
                  </span>
                  {showResult && (
                    <span className="block text-xs font-normal mt-0.5 text-red-400">{redPct}%</span>
                  )}
                </button>

                <span className="shrink-0 text-xs font-black text-zinc-600">VS</span>

                {/* 青コーナー */}
                <button
                  onClick={() => handlePick(i, "blue")}
                  disabled={!!myPick || isPast}
                  className={`flex-1 rounded-lg border py-2 px-2 text-xs sm:text-sm font-bold transition-all text-right ${
                    myPick === "blue"
                      ? "border-blue-500 bg-blue-500/20 text-blue-300"
                      : myPick || isPast
                      ? "border-zinc-700 bg-zinc-800 text-zinc-500 cursor-default"
                      : "border-zinc-700 bg-zinc-800 text-white hover:border-blue-500/50 hover:bg-blue-950/30 cursor-pointer"
                  }`}
                >
                  <span className="block truncate">
                    {fight.blueCorner.name} {fight.blueCorner.country}
                  </span>
                  {showResult && (
                    <span className="block text-xs font-normal mt-0.5 text-blue-400">{bluePct}%</span>
                  )}
                </button>
              </div>

              {/* 割合バー */}
              {showResult && total > 0 && (
                <div className="mt-2 h-1.5 rounded-full bg-zinc-800 overflow-hidden flex">
                  <div
                    className="h-full bg-red-500 transition-all duration-500"
                    style={{ width: `${redPct}%` }}
                  />
                  <div className="h-full bg-blue-500 flex-1" />
                </div>
              )}

              {!myPick && !isPast && !loading && (
                <p className="text-xs text-zinc-600 mt-2 text-center">タップして予想</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
