"use client";

import { useState, useEffect } from "react";
import type { Comment } from "../api/comments/route";

interface Props {
  eventId: string;
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

export default function CommentSection({ eventId }: Props) {
  const nameKey = "biewun_username";
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setName(localStorage.getItem(nameKey) ?? "");
    fetch(`/api/comments?eventId=${eventId}`)
      .then((r) => r.json())
      .then(setComments)
      .catch(() => {});
  }, [eventId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    setSubmitting(true);
    localStorage.setItem(nameKey, name);

    // 楽観的更新：即座に表示
    const optimistic: Comment = {
      id: crypto.randomUUID(),
      eventId,
      fightIndex: -1,
      name: name.trim(),
      text: text.trim(),
      corner: null,
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => [optimistic, ...prev]);
    setText("");
    setShowForm(false);
    setSubmitting(false);

    // バックグラウンドでサーバー同期
    try {
      await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, name, text }),
      });
    } catch {
      // ignore
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-base">💬</span>
        <h2 className="text-sm font-bold text-white tracking-wide">みんなのコメント</h2>
        {comments.length > 0 && (
          <span className="text-xs text-zinc-600">{comments.length}件</span>
        )}
      </div>

      {/* コメント一覧 */}
      {comments.length > 0 && (
        <div className="flex flex-col gap-3 mb-4">
          {comments.map((c) => (
            <div key={c.id} className="flex items-start gap-2">
              <div className="shrink-0 w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-400">
                {c.name.slice(0, 1)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-zinc-300">{c.name}</span>
                  <span className="text-xs text-zinc-600">{timeAgo(c.createdAt)}</span>
                </div>
                <p className="text-sm text-zinc-300 mt-0.5 break-words leading-relaxed">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* コメント投稿 */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full rounded-xl border border-dashed border-zinc-700 py-2.5 text-xs text-zinc-500 hover:text-zinc-300 hover:border-zinc-500 transition-colors"
        >
          + コメントを書く
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="名前（ニックネームOK）"
            maxLength={20}
            required
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="予想・感想・盛り上がりを共有しよう（200文字以内）"
            maxLength={200}
            required
            rows={3}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 resize-none"
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-xs text-zinc-600 hover:text-zinc-400 px-3 py-1.5"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-500 disabled:opacity-50 transition-colors"
            >
              {submitting ? "送信中..." : "投稿する"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
