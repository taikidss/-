"use client";

import { useState, useEffect } from "react";
import type { Comment } from "../api/comments/route";

interface Props {
  eventId: string;
  fightIndex: number;
  myCorner: "red" | "blue" | null;
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

export default function CommentSection({ eventId, fightIndex, myCorner }: Props) {
  const nameKey = "biewun_username";
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setName(localStorage.getItem(nameKey) ?? "");
    fetch(`/api/comments?eventId=${eventId}&fightIndex=${fightIndex}`)
      .then((r) => r.json())
      .then(setComments)
      .catch(() => {});
  }, [eventId, fightIndex]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    setSubmitting(true);
    localStorage.setItem(nameKey, name);

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, fightIndex, name, text, corner: myCorner }),
    });
    if (res.ok) {
      const comment = await res.json();
      setComments((prev) => [comment, ...prev]);
      setText("");
      setShowForm(false);
    }
    setSubmitting(false);
  }

  return (
    <div className="mt-2 px-3 pb-3">
      {/* コメント一覧 */}
      {comments.length > 0 && (
        <div className="flex flex-col gap-2 mb-3">
          {comments.map((c) => (
            <div key={c.id} className="flex items-start gap-2">
              {/* コーナーバッジ */}
              {c.corner === "red" && (
                <span className="shrink-0 mt-0.5 rounded-full bg-red-900/60 border border-red-700/50 px-1.5 py-0.5 text-xs font-bold text-red-400">🔴</span>
              )}
              {c.corner === "blue" && (
                <span className="shrink-0 mt-0.5 rounded-full bg-blue-900/60 border border-blue-700/50 px-1.5 py-0.5 text-xs font-bold text-blue-400">🔵</span>
              )}
              {!c.corner && (
                <span className="shrink-0 mt-0.5 rounded-full bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 text-xs text-zinc-500">－</span>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-zinc-300">{c.name}</span>
                  <span className="text-xs text-zinc-600">{timeAgo(c.createdAt)}</span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5 break-words">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* コメント投稿 */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          💬 コメントする
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-1">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="名前（ニックネームOK）"
            maxLength={20}
            required
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="予想・感想を書く（200文字以内）"
            maxLength={200}
            required
            rows={2}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 resize-none"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-xs text-zinc-600 hover:text-zinc-400"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="ml-auto rounded-full bg-zinc-700 px-3 py-1 text-xs font-bold text-white hover:bg-zinc-600 disabled:opacity-50 transition-colors"
            >
              {submitting ? "送信中..." : "投稿"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
