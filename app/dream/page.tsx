"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { dreamMatches, type DreamMatch } from "../data/dreamMatches";
import type { UserDreamMatch } from "../api/dream-matches/route";

type Category = "RIZIN" | "ONE" | "BOXING";

type AnyMatch = {
  id: string;
  category: Category;
  fighter1: { name: string; country?: string };
  fighter2: { name: string; country?: string };
  weightClass: string;
  note?: string;
  isUserCreated?: boolean;
};

const CAT = {
  RIZIN: {
    active: "bg-red-600 text-white shadow-lg shadow-red-900/40",
    border: "border-red-900/50",
    bg: "bg-gradient-to-r from-red-950/50 to-zinc-900",
    voteBtn: "bg-red-600 hover:bg-red-500",
    bar: "bg-red-500",
    accent: "text-red-400",
  },
  ONE: {
    active: "bg-yellow-400 text-black shadow-lg shadow-yellow-900/40",
    border: "border-yellow-900/50",
    bg: "bg-gradient-to-r from-yellow-950/40 to-zinc-900",
    voteBtn: "bg-yellow-400 hover:bg-yellow-300 !text-black",
    bar: "bg-yellow-400",
    accent: "text-yellow-400",
  },
  BOXING: {
    active: "bg-blue-600 text-white shadow-lg shadow-blue-900/40",
    border: "border-blue-900/50",
    bg: "bg-gradient-to-r from-blue-950/50 to-zinc-900",
    voteBtn: "bg-blue-600 hover:bg-blue-500",
    bar: "bg-blue-500",
    accent: "text-blue-400",
  },
};

const WEIGHT_OPTIONS: Record<Category, string[]> = {
  RIZIN: ["アトム級 48kg", "スーパーアトム級 52kg", "バンタム級 61kg", "フェザー級 66kg", "ライト級 70kg", "ウェルター級 77.1kg", "ミドル級 83.9kg", "ヘビー級"],
  ONE: ["アトム級MMA", "ストロー級MMA", "フライ級MMA", "バンタム級MMA", "フェザー級MMA", "ライト級MMA", "アトム級ムエタイ", "ストロー級ムエタイ", "ライト級キックボクシング"],
  BOXING: ["ミニマム級", "ライトフライ級", "フライ級", "スーパーフライ級", "バンタム級", "スーパーバンタム級", "フェザー級", "スーパーフェザー級", "ライト級"],
};

export default function DreamPage() {
  const [category, setCategory] = useState<Category>("RIZIN");
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [voted, setVoted] = useState<Set<string>>(new Set());
  const [userMatches, setUserMatches] = useState<AnyMatch[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fighter1: "", fighter2: "", weightClass: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const saved = new Set<string>();
    dreamMatches.forEach((m) => {
      if (localStorage.getItem(`dream-voted-${m.id}`)) saved.add(m.id);
    });
    setVoted(saved);

    fetch("/api/dream-votes").then((r) => r.json()).then(setVotes).catch(() => {});
    fetch("/api/dream-matches")
      .then((r) => r.json())
      .then((data: UserDreamMatch[]) =>
        setUserMatches(
          data.map((m) => ({
            id: m.id,
            category: m.category,
            fighter1: { name: m.fighter1 },
            fighter2: { name: m.fighter2 },
            weightClass: m.weightClass,
            isUserCreated: true,
          }))
        )
      )
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

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fighter1.trim() || !form.fighter2.trim() || !form.weightClass) return;
    setSubmitting(true);

    const optimistic: AnyMatch = {
      id: `user-${Date.now()}`,
      category,
      fighter1: { name: form.fighter1.trim() },
      fighter2: { name: form.fighter2.trim() },
      weightClass: form.weightClass,
      isUserCreated: true,
    };
    setUserMatches((prev) => [optimistic, ...prev]);
    setForm({ fighter1: "", fighter2: "", weightClass: "" });
    setShowForm(false);
    setSubmitting(false);

    try {
      const res = await fetch("/api/dream-matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, ...form }),
      });
      if (res.ok) {
        const created: UserDreamMatch = await res.json();
        setUserMatches((prev) =>
          prev.map((m) =>
            m.id === optimistic.id
              ? { ...m, id: created.id }
              : m
          )
        );
      }
    } catch {}
  }

  const allMatches: AnyMatch[] = [
    ...dreamMatches.map((m) => ({ ...m, fighter1: m.fighter1, fighter2: m.fighter2 })),
    ...userMatches,
  ];

  const filtered = allMatches
    .filter((m) => m.category === category)
    .map((m) => ({ ...m, count: votes[m.id] ?? 0 }))
    .sort((a, b) => b.count - a.count);

  const totalVotes = filtered.reduce((s, m) => s + m.count, 0);
  const cfg = CAT[category];
  const topCount = filtered[0]?.count ?? 1;

  const rankIcon = ["👑", "🥈", "🥉"];

  return (
    <div className="min-h-screen">
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold tracking-tight text-white">ビューン</Link>
        <div className="flex items-center gap-3">
          {totalVotes > 0 && <span className="text-xs text-zinc-500">{totalVotes.toLocaleString()}票</span>}
          <button
            onClick={() => setShowForm(true)}
            className="rounded-full bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs font-bold text-zinc-300 hover:bg-zinc-700 transition-colors"
          >
            ＋ 作る
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-8 pb-16">
        {/* ヒーロー */}
        <div className="text-center mb-8">
          <p className="text-4xl mb-3">🥊</p>
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
            const barPct = topCount > 0 ? Math.round((match.count / topCount) * 100) : 0;

            return (
              <div
                key={match.id}
                className={`rounded-2xl border ${cfg.border} ${cfg.bg} overflow-hidden`}
              >
                <div className="flex items-stretch">
                  {/* ランク */}
                  <div className="flex items-center justify-center w-12 shrink-0 text-xl font-black">
                    {i < 3 ? rankIcon[i] : <span className="text-zinc-700 text-base">{i + 1}</span>}
                  </div>

                  <div className="flex-1 py-4 pr-4">
                    {/* バッジ行 */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs text-zinc-500">{match.weightClass}</span>
                      {match.note && (
                        <span className="rounded-full bg-zinc-800/80 px-2 py-0.5 text-xs text-zinc-400 border border-zinc-700/50">
                          {match.note}
                        </span>
                      )}
                      {match.isUserCreated && (
                        <span className="rounded-full bg-zinc-700/60 px-2 py-0.5 text-xs text-zinc-400 border border-zinc-600/40">
                          👤 ファン投稿
                        </span>
                      )}
                    </div>

                    {/* 選手名 */}
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="font-black text-white text-base leading-snug">
                        {match.fighter1.country && <span className="mr-0.5">{match.fighter1.country}</span>}
                        {match.fighter1.name}
                      </span>
                      <span className="text-xs font-black text-zinc-600 bg-zinc-800 rounded-full w-7 h-7 flex items-center justify-center shrink-0">
                        VS
                      </span>
                      <span className="font-black text-white text-base leading-snug">
                        {match.fighter2.country && <span className="mr-0.5">{match.fighter2.country}</span>}
                        {match.fighter2.name}
                      </span>
                    </div>

                    {/* 票数バー */}
                    {match.count > 0 && (
                      <div className="mb-3">
                        <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${cfg.bar}`}
                            style={{ width: `${barPct}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* アクション */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <button
                        onClick={() => handleVote(match.id)}
                        disabled={hasVoted}
                        className={`rounded-full px-4 py-1.5 text-sm font-black transition-all active:scale-95 text-white ${
                          hasVoted
                            ? "bg-zinc-800 text-zinc-500 cursor-default"
                            : `${cfg.voteBtn} shadow-md`
                        }`}
                      >
                        {hasVoted ? "✓ 投票済み" : "見たい！🥊"}
                      </button>

                      {match.count > 0 && (
                        <span className={`text-sm font-bold ${cfg.accent}`}>
                          {match.count.toLocaleString()}
                          <span className="text-xs text-zinc-500 ml-0.5">票</span>
                        </span>
                      )}

                      {hasVoted && (
                        <a
                          href={`https://x.com/intent/post?text=${encodeURIComponent(
                            `🥊【ドリームマッチ】\n${match.fighter1.name} vs ${match.fighter2.name}\n\nこの試合を絶対に見たい！\n${match.count}人が支持中⚡\n\n#${category} #ビューン`
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

        {/* 作るボタン（下） */}
        <button
          onClick={() => setShowForm(true)}
          className={`mt-6 w-full rounded-2xl border border-dashed ${cfg.border} py-4 text-sm font-bold ${cfg.accent} hover:bg-zinc-900/50 transition-colors`}
        >
          ＋ 見たいドリームマッチを追加する
        </button>
      </main>

      {/* 作成モーダル */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
        >
          <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-700 p-6">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xl">🥊</span>
              <h2 className="text-base font-black text-white">ドリームマッチを作る</h2>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              {/* カテゴリー */}
              <div className="flex gap-2">
                {(["RIZIN", "ONE", "BOXING"] as Category[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, weightClass: "" })) || setCategory(cat)}
                    className={`flex-1 rounded-xl py-2 text-xs font-black transition-all ${
                      category === cat ? CAT[cat].active : "bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* 選手名 */}
              <div className="flex items-center gap-2">
                <input
                  value={form.fighter1}
                  onChange={(e) => setForm((f) => ({ ...f, fighter1: e.target.value }))}
                  placeholder="選手1の名前"
                  maxLength={30}
                  required
                  className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                />
                <span className="text-xs font-black text-zinc-600 shrink-0">VS</span>
                <input
                  value={form.fighter2}
                  onChange={(e) => setForm((f) => ({ ...f, fighter2: e.target.value }))}
                  placeholder="選手2の名前"
                  maxLength={30}
                  required
                  className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                />
              </div>

              {/* 階級 */}
              <select
                value={form.weightClass}
                onChange={(e) => setForm((f) => ({ ...f, weightClass: e.target.value }))}
                required
                className="rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-500"
              >
                <option value="">階級を選ぶ</option>
                {WEIGHT_OPTIONS[category].map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>

              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 rounded-xl border border-zinc-700 py-2.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex-1 rounded-xl py-2.5 text-sm font-black text-white transition-all active:scale-95 disabled:opacity-50 ${
                    category === "RIZIN" ? "bg-red-600 hover:bg-red-500" :
                    category === "ONE" ? "bg-yellow-400 text-black hover:bg-yellow-300" :
                    "bg-blue-600 hover:bg-blue-500"
                  }`}
                >
                  {submitting ? "作成中..." : "投票に追加する 🥊"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
