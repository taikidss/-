"use client";

import { useState, useEffect } from "react";
import type { NewsItem } from "../api/news/route";

function timeAgo(dateStr: string) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "1時間以内";
  if (h < 24) return `${h}時間前`;
  return `${Math.floor(h / 24)}日前`;
}

const LIMIT = 5;

export default function NewsSection() {
  const [all, setAll] = useState<NewsItem[]>([]);
  const [tab, setTab] = useState<"mma" | "boxing">("mma");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((data) => { setAll(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = all.filter((n) => n.category === tab).slice(0, LIMIT);

  return (
    <section className="px-5 pb-8 max-w-4xl mx-auto">
      {/* ヘッダー＋タブ */}
      <div className="flex items-center gap-3 mb-3">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">news</p>
        <div className="flex gap-1 ml-auto">
          <button
            onClick={() => setTab("mma")}
            className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
              tab === "mma" ? "bg-red-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            格闘技
          </button>
          <button
            onClick={() => setTab("boxing")}
            className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
              tab === "boxing" ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            ボクシング
          </button>
        </div>
      </div>

      {/* リスト */}
      <div className="rounded-2xl border border-zinc-800 overflow-hidden">
        {loading ? (
          [...Array(LIMIT)].map((_, i) => (
            <div key={i} className="h-12 bg-zinc-900 animate-pulse border-b border-zinc-800 last:border-0" />
          ))
        ) : filtered.length === 0 ? (
          <div className="py-6 text-center text-xs text-zinc-600 bg-zinc-900">ニュースを読み込み中...</div>
        ) : (
          filtered.map((item, i) => (
            <a
              key={i}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 transition-colors border-b border-zinc-800 last:border-0"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white leading-snug line-clamp-1">{item.title}</p>
                <p className="text-xs text-zinc-600 mt-0.5 truncate">
                  {item.source}{item.pubDate ? ` · ${timeAgo(item.pubDate)}` : ""}
                </p>
              </div>
              <span className="text-zinc-600 text-xs shrink-0">→</span>
            </a>
          ))
        )}
      </div>
    </section>
  );
}
