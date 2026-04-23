"use client";

import { useState, useEffect } from "react";
import type { Comment } from "../api/comments/route";

interface Props {
  eventId: string;
  mainFightIndex?: number;
  redCornerName?: string;
  blueCornerName?: string;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "たった今";
  if (m < 60) return `${m}分前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}時間前`;
  return `${Math.floor(h / 24)}日前`;
}

export default function CommentSection({ eventId, mainFightIndex = 0, redCornerName, blueCornerName }: Props) {
  const nameKey = "biewun_username";
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [myCorner, setMyCorner] = useState<"red" | "blue" | null>(null);

  useEffect(() => {
    setName(localStorage.getItem(nameKey) ?? "");
    const saved = localStorage.getItem(`picks-${eventId}`);
    if (saved) {
      const picks = JSON.parse(saved);
      setMyCorner(picks[mainFightIndex] ?? null);
    }
    fetch(`/api/comments?eventId=${eventId}`)
      .then((r) => r.json())
      .then(setComments)
      .catch(() => {});
  }, [eventId, mainFightIndex]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    setSubmitting(true);
    localStorage.setItem(nameKey, name);

    const optimistic: Comment = {
      id: crypto.randomUUID(),
      eventId,
      fightIndex: -1,
      name: name.trim(),
      text: text.trim(),
      corner: myCorner,
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => [optimistic, ...prev]);
    setText("");
    setShowForm(false);
    setSubmitting(false);

    try {
      await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, name, text, corner: myCorner }),
      });
    } catch {
      // ignore
    }
  }

  const redCount = comments.filter((c) => c.corner === "red").length;
  const blueCount = comments.filter((c) => c.corner === "blue").length;

  return (
    <div className="mt-6">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
        <div className="flex items-center gap-2">
          <span className="text-sm">🔥</span>
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">予想トーク</span>
          {comments.length > 0 && (
            <span className="text-xs bg-zinc-800 text-zinc-500 rounded-full px-2 py-0.5">{comments.length}</span>
          )}
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
      </div>

      {/* 赤青カウント */}
      {comments.length > 0 && (
        <div className="flex gap-2 mb-4">
          <div className="flex-1 flex items-center gap-2 rounded-xl bg-red-950/30 border border-red-900/40 px-3 py-2">
            <span className="text-base">🔴</span>
            <div>
              <p className="text-xs text-red-400 font-bold">{redCount}人</p>
              <p className="text-xs text-red-900/80 truncate">{redCornerName ?? "赤コーナー"}派</p>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-2 rounded-xl bg-blue-950/30 border border-blue-900/40 px-3 py-2">
            <span className="text-base">🔵</span>
            <div>
              <p className="text-xs text-blue-400 font-bold">{blueCount}人</p>
              <p className="text-xs text-blue-900/80 truncate">{blueCornerName ?? "青コーナー"}派</p>
            </div>
          </div>
        </div>
      )}

      {/* 自分の予想バナー */}
      {myCorner && (
        <div className={`mb-4 rounded-xl px-4 py-2.5 flex items-center gap-2.5 ${
          myCorner === "red"
            ? "bg-gradient-to-r from-red-950/60 to-zinc-900 border border-red-800/40"
            : "bg-gradient-to-r from-blue-950/60 to-zinc-900 border border-blue-800/40"
        }`}>
          <span className="text-lg">{myCorner === "red" ? "🔴" : "🔵"}</span>
          <div>
            <p className="text-xs font-black text-white">
            あなたは{myCorner === "red" ? (redCornerName ?? "赤コーナー") : (blueCornerName ?? "青コーナー")}派
          </p>
            <p className="text-xs text-zinc-500">コメントに予想が表示されます</p>
          </div>
        </div>
      )}

      {/* コメント一覧 */}
      {comments.length > 0 ? (
        <div className="flex flex-col gap-2 mb-4">
          {comments.map((c) => (
            <div
              key={c.id}
              className={`relative rounded-2xl px-4 py-3 border ${
                c.corner === "red"
                  ? "bg-gradient-to-r from-red-950/40 to-zinc-900 border-red-900/40"
                  : c.corner === "blue"
                  ? "bg-gradient-to-r from-blue-950/40 to-zinc-900 border-blue-900/40"
                  : "bg-zinc-900 border-zinc-800"
              }`}
            >
              <div className="flex items-start gap-3">
                {/* アバター */}
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${
                  c.corner === "red"
                    ? "bg-red-900/70 text-red-200"
                    : c.corner === "blue"
                    ? "bg-blue-900/70 text-blue-200"
                    : "bg-zinc-800 text-zinc-400"
                }`}>
                  {c.name.slice(0, 1)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-bold text-white">{c.name}</span>
                    {c.corner === "red" && (
                      <span className="rounded-full bg-red-500/15 border border-red-500/30 px-2 py-0.5 text-xs font-bold text-red-400">
                        🔴 {redCornerName ?? "赤コーナー"}
                      </span>
                    )}
                    {c.corner === "blue" && (
                      <span className="rounded-full bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 text-xs font-bold text-blue-400">
                        🔵 {blueCornerName ?? "青コーナー"}
                      </span>
                    )}
                    <span className="text-xs text-zinc-600 ml-auto">{timeAgo(c.createdAt)}</span>
                  </div>
                  <p className="text-sm text-zinc-300 break-words leading-relaxed">{c.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-4 rounded-2xl border border-dashed border-zinc-800 py-8 text-center">
          <p className="text-2xl mb-2">🥊</p>
          <p className="text-sm font-bold text-zinc-400">まだコメントがありません</p>
          <p className="text-xs text-zinc-600 mt-1">最初の予想トークを始めよう</p>
        </div>
      )}

      {/* 投稿フォーム */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className={`w-full rounded-2xl py-3 text-sm font-bold transition-all border ${
            myCorner === "red"
              ? "bg-red-950/30 border-red-800/50 text-red-400 hover:bg-red-950/50"
              : myCorner === "blue"
              ? "bg-blue-950/30 border-blue-800/50 text-blue-400 hover:bg-blue-950/50"
              : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300"
          }`}
        >
          {myCorner === "red" ? "🔴 " : myCorner === "blue" ? "🔵 " : "💬 "}
          予想トークに参加する
        </button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className={`rounded-2xl border p-4 flex flex-col gap-3 ${
            myCorner === "red"
              ? "bg-gradient-to-b from-red-950/30 to-zinc-900 border-red-800/40"
              : myCorner === "blue"
              ? "bg-gradient-to-b from-blue-950/30 to-zinc-900 border-blue-800/40"
              : "bg-zinc-900 border-zinc-700"
          }`}
        >
          {myCorner && (
            <div className={`flex items-center gap-2 text-xs font-bold ${myCorner === "red" ? "text-red-400" : "text-blue-400"}`}>
              <span>{myCorner === "red" ? "🔴" : "🔵"}</span>
              {myCorner === "red" ? (redCornerName ?? "赤コーナー") : (blueCornerName ?? "青コーナー")}派として投稿
            </div>
          )}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ニックネーム"
            maxLength={20}
            required
            className="rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="予想・感想・煽りなんでもOK 🔥"
            maxLength={200}
            required
            rows={3}
            className="rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 resize-none"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-xs text-zinc-600 hover:text-zinc-400 px-3 py-2"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`ml-auto rounded-full px-5 py-2 text-sm font-black text-white disabled:opacity-50 transition-colors ${
                myCorner === "red"
                  ? "bg-red-600 hover:bg-red-500"
                  : myCorner === "blue"
                  ? "bg-blue-600 hover:bg-blue-500"
                  : "bg-zinc-700 hover:bg-zinc-600"
              }`}
            >
              {submitting ? "送信中..." : "投稿する 🔥"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
