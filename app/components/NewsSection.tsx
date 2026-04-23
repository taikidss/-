"use client";

import { useState, useEffect } from "react";

type NewsItem = {
  title: string;
  link: string;
  pubDate: string;
  source: string;
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "1時間以内";
  if (h < 24) return `${h}時間前`;
  return `${Math.floor(h / 24)}日前`;
}

export default function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((data) => { setNews(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="px-5 pb-8 max-w-4xl mx-auto">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">news</p>
        <div className="flex flex-col gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-zinc-900 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (news.length === 0) return null;

  return (
    <section className="px-5 pb-10 max-w-4xl mx-auto">
      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">news</p>
      <div className="flex flex-col divide-y divide-zinc-800 rounded-2xl border border-zinc-800 overflow-hidden">
        {news.map((item, i) => (
          <a
            key={i}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 px-4 py-3 bg-zinc-900 hover:bg-zinc-800 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white leading-snug line-clamp-2">
                {item.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-zinc-500 truncate">{item.source}</span>
                {item.pubDate && (
                  <>
                    <span className="text-zinc-700">·</span>
                    <span className="text-xs text-zinc-600 shrink-0">{timeAgo(item.pubDate)}</span>
                  </>
                )}
              </div>
            </div>
            <span className="text-zinc-600 text-sm shrink-0 mt-0.5">→</span>
          </a>
        ))}
      </div>
    </section>
  );
}
