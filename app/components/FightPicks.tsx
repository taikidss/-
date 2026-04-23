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
  eventName: string;
  fights: Fight[];
  isPast: boolean;
}

function buildShareUrl(
  eventName: string,
  eventId: string,
  fight: Fight,
  myPick: "red" | "blue",
  pct: number
): string {
  const pickedName = myPick === "red" ? fight.redCorner.name : fight.blueCorner.name;
  const pickedEmoji = myPick === "red" ? "🔴" : "🔵";
  const url = `${typeof window !== "undefined" ? window.location.origin : ""}/event/${eventId}`;
  const text = `🥊【${eventName} 予想】\n${fight.redCorner.name} vs ${fight.blueCorner.name}\n\n俺は${pickedEmoji}${pickedName}の勝ち！\n現在${pct}%が同じ予想🔥\n\n#ビューン`;
  return `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
}

export default function FightPicks({ eventId, eventName, fights, isPast }: Props) {
  const storageKey = `picks-${eventId}`;
  const [picks, setPicks] = useState<Record<number, "red" | "blue">>({});
  const [counts, setCounts] = useState<PickEntry[]>([]);
  const [flashing, setFlashing] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setPicks(JSON.parse(saved));
    fetch(`/api/picks?eventId=${eventId}`)
      .then((r) => r.json())
      .then(setCounts)
      .catch(() => {});
  }, [eventId, storageKey]);

  async function handlePick(fightIndex: number, corner: "red" | "blue") {
    if (picks[fightIndex] || isPast) return;

    // 即座にUI更新（楽観的更新）
    const newPicks = { ...picks, [fightIndex]: corner };
    setPicks(newPicks);
    localStorage.setItem(storageKey, JSON.stringify(newPicks));
    setFlashing(fightIndex);
    setTimeout(() => setFlashing(null), 400);
    setCounts((prev) => {
      const existing = prev.find((p) => p.fightIndex === fightIndex);
      const next = prev.filter((p) => p.fightIndex !== fightIndex);
      return [...next, {
        fightIndex,
        red: (existing?.red ?? 0) + (corner === "red" ? 1 : 0),
        blue: (existing?.blue ?? 0) + (corner === "blue" ? 1 : 0),
      }];
    });

    // サーバー同期（失敗しても無視）
    try {
      await fetch("/api/picks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, fightIndex, corner }),
      });
    } catch {
      // ignore
    }
  }

  return (
    <div className="flex flex-col gap-3 mt-6">
      <div className="flex items-center gap-2">
        <span className="text-base">🥊</span>
        <h2 className="text-sm font-bold text-white tracking-wide">
          {isPast ? "みんなの予想結果" : "勝者を予想しよう"}
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        {fights.map((fight, i) => {
          const myPick = picks[i];
          const count = counts.find((c) => c.fightIndex === i);
          const total = (count?.red ?? 0) + (count?.blue ?? 0);
          const redPct = total > 0 ? Math.round(((count?.red ?? 0) / total) * 100) : 50;
          const bluePct = 100 - redPct;
          const showResult = !!myPick || isPast;
          const isFlashing = flashing === i;

          return (
            <div
              key={i}
              className={`rounded-2xl overflow-hidden border bg-zinc-950 ${
                fight.status === "cancelled" ? "border-orange-900/60 opacity-60" : "border-zinc-800"
              } ${isFlashing ? "animate-pick-flash" : ""}`}
            >
              {fight.status === "cancelled" && (
                <div className="flex items-center gap-2 bg-orange-950/60 border-b border-orange-900/50 px-4 py-2">
                  <span>⚠️</span>
                  <p className="text-xs font-bold text-orange-400">
                    試合中止{fight.statusNote ? `：${fight.statusNote}` : ""}
                  </p>
                </div>
              )}
              {fight.status === "changed" && (
                <div className="flex items-center gap-2 bg-yellow-950/60 border-b border-yellow-900/50 px-4 py-2">
                  <span>🔄</span>
                  <p className="text-xs font-bold text-yellow-400">
                    変更あり{fight.statusNote ? `：${fight.statusNote}` : ""}
                  </p>
                </div>
              )}
              {/* バッジ行 */}
              <div className="flex items-center justify-between px-4 pt-3 pb-1">
                <div className="flex items-center gap-1.5">
                  {fight.isTitleMatch && (
                    <span className="rounded-full bg-yellow-500/15 border border-yellow-500/30 px-2 py-0.5 text-xs font-bold text-yellow-400">
                      🏆 タイトル
                    </span>
                  )}
                  <span className="text-xs text-zinc-600">{fight.weightClass} · {fight.rule}</span>
                </div>
                {total > 0 && (
                  <span className="text-xs text-zinc-600">{total.toLocaleString()}票</span>
                )}
              </div>

              {/* コーナーボタン */}
              <div className="flex items-stretch gap-0 px-3 pb-3 pt-1">
                {/* 赤コーナー */}
                <button
                  onClick={() => handlePick(i, "red")}
                  disabled={!!myPick || isPast}
                  className={`relative flex-1 rounded-xl p-3 text-left transition-all duration-200 border-2 ${
                    myPick === "red"
                      ? "border-red-500 bg-gradient-to-br from-red-900/80 to-red-950 scale-[1.02] shadow-lg shadow-red-900/40"
                      : myPick || isPast
                      ? "border-zinc-800 bg-zinc-900 opacity-50 cursor-default"
                      : "border-red-900/40 bg-gradient-to-br from-red-950/60 to-zinc-900 hover:border-red-600/60 hover:from-red-900/60 hover:scale-[1.01] cursor-pointer active:scale-[0.99]"
                  }`}
                >
                  <span className="block text-xs font-black tracking-widest mb-1.5"
                    style={{ color: myPick === "red" ? "#fca5a5" : "#7f1d1d" }}>
                    🔴 RED
                  </span>
                  <span className={`block font-black leading-snug ${
                    myPick === "red" ? "text-white text-sm sm:text-base" : "text-zinc-300 text-xs sm:text-sm"
                  }`}>
                    {fight.redCorner.country && <span className="mr-1">{fight.redCorner.country}</span>}
                    {fight.redCorner.name}
                  </span>
                  {showResult && (
                    <span className="animate-fade-in block text-xl font-black mt-1 text-red-400">
                      {redPct}%
                    </span>
                  )}
                  {myPick === "red" && (
                    <span className="absolute top-2 right-2 text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5 font-bold">
                      ✓ 予想
                    </span>
                  )}
                </button>

                {/* VS */}
                <div className="flex items-center justify-center px-2 shrink-0">
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-black text-zinc-400 bg-zinc-800 rounded-full w-8 h-8 flex items-center justify-center border border-zinc-700">
                      VS
                    </span>
                  </div>
                </div>

                {/* 青コーナー */}
                <button
                  onClick={() => handlePick(i, "blue")}
                  disabled={!!myPick || isPast}
                  className={`relative flex-1 rounded-xl p-3 text-right transition-all duration-200 border-2 ${
                    myPick === "blue"
                      ? "border-blue-500 bg-gradient-to-bl from-blue-900/80 to-blue-950 scale-[1.02] shadow-lg shadow-blue-900/40"
                      : myPick || isPast
                      ? "border-zinc-800 bg-zinc-900 opacity-50 cursor-default"
                      : "border-blue-900/40 bg-gradient-to-bl from-blue-950/60 to-zinc-900 hover:border-blue-600/60 hover:from-blue-900/60 hover:scale-[1.01] cursor-pointer active:scale-[0.99]"
                  }`}
                >
                  <span className="block text-xs font-black tracking-widest mb-1.5"
                    style={{ color: myPick === "blue" ? "#93c5fd" : "#1e3a5f" }}>
                    BLUE 🔵
                  </span>
                  <span className={`block font-black leading-snug ${
                    myPick === "blue" ? "text-white text-sm sm:text-base" : "text-zinc-300 text-xs sm:text-sm"
                  }`}>
                    {fight.blueCorner.name}
                    {fight.blueCorner.country && <span className="ml-1">{fight.blueCorner.country}</span>}
                  </span>
                  {showResult && (
                    <span className="animate-fade-in block text-xl font-black mt-1 text-blue-400">
                      {bluePct}%
                    </span>
                  )}
                  {myPick === "blue" && (
                    <span className="absolute top-2 left-2 text-xs bg-blue-500 text-white rounded-full px-1.5 py-0.5 font-bold">
                      ✓ 予想
                    </span>
                  )}
                </button>
              </div>

              {/* 割合バー */}
              {showResult && total > 0 && (
                <div className="px-3 pb-3">
                  <div className="h-2 rounded-full bg-zinc-800 overflow-hidden flex">
                    <div
                      className="h-full rounded-l-full animate-bar-grow"
                      style={{
                        width: `${redPct}%`,
                        background: "linear-gradient(to right, #dc2626, #ef4444)",
                      }}
                    />
                    <div
                      className="h-full rounded-r-full flex-1"
                      style={{ background: "linear-gradient(to left, #2563eb, #3b82f6)" }}
                    />
                  </div>
                </div>
              )}

              {/* シェアボタン */}
              {myPick && (
                <div className="px-3 pb-3 flex justify-end">
                  <a
                    href={buildShareUrl(
                      eventName,
                      eventId,
                      fight,
                      myPick,
                      myPick === "red" ? redPct : bluePct
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-full bg-sky-950/60 border border-sky-800/50 px-3 py-1.5 text-xs font-bold text-sky-400 hover:bg-sky-900/60 transition-colors animate-fade-in"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.859L1.255 2.25H8.08l4.253 5.622L18.244 2.25zM17.083 19.77h1.833L7.084 4.126H5.117L17.083 19.77z"/>
                    </svg>
                    予想をXでシェア
                  </a>
                </div>
              )}

              {/* 予想前のヒント */}
              {!myPick && !isPast && (
                <div className="px-4 pb-1 text-center">
                  <p className="text-xs text-zinc-600">← タップして勝者を予想 →</p>
                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}
