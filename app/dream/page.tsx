"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { dreamMatches } from "../data/dreamMatches";

type Category = "RIZIN" | "ONE" | "BOXING";

const CAT = {
  RIZIN: {
    active: "bg-red-600 text-white shadow-lg shadow-red-900/40",
    border: "border-red-900/50",
    bg: "bg-gradient-to-r from-red-950/50 to-zinc-900",
    voteBtn: "bg-red-600 hover:bg-red-500 shadow-red-900/30",
    bar: "bg-red-600",
  },
  ONE: {
    active: "bg-yellow-400 text-black shadow-lg shadow-yellow-900/40",
    border: "border-yellow-900/50",
    bg: "bg-gradient-to-r from-yellow-950/40 to-zinc-900",
    voteBtn: "bg-yellow-400 hover:bg-yellow-300 text-black shadow-yellow-900/30",
    bar: "bg-yellow-400",
  },
  BOXING: {
    active: "bg-blue-600 text-white shadow-lg shadow-blue-900/40",
    border: "border-blue-900/50",
    bg: "bg-gradient-to-r from-blue-950/50 to-zinc-900",
    voteBtn: "bg-blue-600 hover:bg-blue-500 shadow-blue-900/30",
    bar: "bg-blue-600",
  },
};

const RANK_STYLE = [
  "text-yellow-400 text-3xl",
  "text-zinc-400 text-2xl",
  "text-amber-600 text-xl",
];

export default function DreamPage() {
  const [category, setCategory] = useState<Category>("RIZIN");
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [voted, setVoted] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = new Set<string>();
    dreamMatches.forEach((m) => {
      if (localStorage.getItem(`dream-voted-${m.id}`)) saved.add(m.id);
    });
    setVoted(saved);

    fetch("/api/dream-votes")
      .then((r) => r.json())
      .then(setVotes)
      .catch(() => {});
  }, []);

  async function handleVote(matchId: string) {
    if (voted.has(matchId)) return;
    setVotes((prev) => ({ ...prev, [matchId]: (prev[matchId] ?? 0) + 1 }));
    setVoted((prev) => new Set([...prev, matchId]));
    localStorage.setItem(`dream-voted-${matchId}`, "1");
    try {
      await fetch("/api/dream-votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId }),
      });
    } catch {}
  }

  const filtered = dreamMatches
    .filter((m) => m.category === category)
    .map((m) => ({ ...m, count: votes[m.id] ?? 0 }))
    .sort((a, b) => b.count - a.count);

  const totalVotes = filtered.reduce((s, m) => s + m.count, 0);
  const cfg = CAT[category];

  return (
    <div className="min-h-screen">
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold tracking-tight text-white">ビューン</Link>
        <span className="text-xs text-zinc-500">{totalVotes.toLocaleString()}票</span>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-8 pb-16">
        {/* ヒーロー */}
        <div className="text-center mb-8">
          <p className="text-3xl mb-2">🔥</p>
          <h1 className="text-2xl font-black text-white tracking-tight">ドリームマッチ投票</h1>
          <p className="text-sm text-zinc-400 mt-2">実現してほしい夢の対戦カードに投票しよう</p>
        </div>

        {/* カテゴリータブ */}
        <div className="flex gap-2 mb-6 p-1 rounded-2xl bg-zinc-900 border border-zinc-800">
          {(["RIZIN", "ONE", "BOXING"] as Category[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex-1 rounded-xl py-2.5 text-sm font-black transition-all duration-200 ${
                category === cat ? CAT[cat].active : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* マッチアップリスト */}
        <div className="flex flex-col gap-3">
          {filtered.map((match, i) => {
            const hasVoted = voted.has(match.id);
            const topCount = filtered[0]?.count ?? 1;
            const barPct = topCount > 0 ? Math.round((match.count / topCount) * 100) : 0;

            return (
              <div
                key={match.id}
                className={`rounded-2xl border ${cfg.border} ${cfg.bg} overflow-hidden transition-transform duration-150 active:scale-[0.99]`}
              >
                <div className="flex items-stretch gap-0">
                  {/* ランク */}
                  <div className={`flex items-center justify-center w-12 shrink-0 ${i < 3 ? RANK_STYLE[i] : "text-zinc-700 text-lg"} font-black`}>
                    {i + 1}
                  </div>

                  <div className="flex-1 py-4 pr-4">
                    {/* バッジ */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-zinc-500">{match.weightClass}</span>
                      {match.note && (
                        <span className="rounded-full bg-zinc-800/80 px-2 py-0.5 text-xs text-zinc-400 border border-zinc-700/50">{match.note}</span>
                      )}
                    </div>

                    {/* 選手名 */}
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="font-black text-white text-base">
                        {match.fighter1.country && <span className="mr-0.5">{match.fighter1.country}</span>}
                        {match.fighter1.name}
                      </span>
                      <span className="text-xs font-black text-zinc-600 bg-zinc-800 rounded-full w-7 h-7 flex items-center justify-center shrink-0">VS</span>
                      <span className="font-black text-white text-base">
                        {match.fighter2.country && <span className="mr-0.5">{match.fighter2.country}</span>}
                        {match.fighter2.name}
                      </span>
                    </div>

                    {/* 票数バー */}
                    {match.count > 0 && (
                      <div className="mb-3">
                        <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${cfg.bar}`}
                            style={{ width: `${barPct}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* アクション */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleVote(match.id)}
                        disabled={hasVoted}
                        className={`rounded-full px-4 py-1.5 text-sm font-black transition-all shadow-md active:scale-95 ${
                          hasVoted
                            ? "bg-zinc-800 text-zinc-500 cursor-default shadow-none"
                            : `${cfg.voteBtn} text-white`
                        }`}
                      >
                        {hasVoted ? "✓ 投票済み" : "👍 見たい！"}
                      </button>

                      {match.count > 0 && (
                        <span className="text-sm font-bold text-zinc-300">
                          {match.count.toLocaleString()}
                          <span className="text-xs text-zinc-500 ml-0.5">票</span>
                        </span>
                      )}

                      {hasVoted && (
                        <a
                          href={`https://x.com/intent/post?text=${encodeURIComponent(
                            `🔥【ドリームマッチ】\n${match.fighter1.name} vs ${match.fighter2.name}\n\nこの試合を絶対に見たい！\n${match.count}人が支持中🔥\n\n#${category} #ビューン`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto flex items-center gap-1.5 rounded-full bg-sky-950/60 border border-sky-800/50 px-3 py-1.5 text-xs font-bold text-sky-400 hover:bg-sky-900/60 transition-colors"
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.859L1.255 2.25H8.08l4.253 5.622L18.244 2.25zM17.083 19.77h1.833L7.084 4.126H5.117L17.083 19.77z"/>
                          </svg>
                          シェア
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
