"use client";

import { useState, useEffect } from "react";

interface Section {
  id: string;
  name: string;
}

interface Props {
  eventId: string;
  eventName: string;
  eventDate: string;
  venueName: string;
  sections: Section[];
}

export default function AttendButton({ eventId, eventName, eventDate, venueName, sections }: Props) {
  const storageKey = `attend-${eventId}`;
  const [attending, setAttending] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [selectedSection, setSelectedSection] = useState("");

  useEffect(() => {
    setAttending(!!localStorage.getItem(storageKey));
  }, [storageKey]);

  function handleAttend() {
    localStorage.setItem(storageKey, "1");
    setAttending(true);
    setExpanded(false);
    const text = [
      `${eventName}に参戦決定！`,
      selectedSection ? `📍 ${venueName} ${sections.find((s) => s.id === selectedSection)?.name ?? ""}` : `📍 ${venueName}`,
      `📅 ${eventDate}`,
      "",
      "#格闘技観戦 #ビューン",
    ].join("\n");
    window.open(`https://x.com/intent/post?text=${encodeURIComponent(text)}`, "_blank");
  }

  if (attending) {
    return (
      <div className="mt-4 flex items-center gap-2 rounded-xl border border-green-900/50 bg-green-950/30 px-4 py-3">
        <span className="text-green-400 text-lg">✓</span>
        <p className="text-sm font-semibold text-green-300">参戦登録済み！</p>
        <button
          onClick={() => { localStorage.removeItem(storageKey); setAttending(false); }}
          className="ml-auto text-xs text-zinc-600 hover:text-zinc-400"
        >
          取り消す
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="w-full rounded-xl border border-red-800 bg-red-950/40 px-4 py-3 text-sm font-bold text-red-300 hover:bg-red-900/40 transition-colors flex items-center justify-center gap-2"
        >
          🎟️ このイベントに参戦する
        </button>
      ) : (
        <div className="rounded-xl border border-red-800 bg-red-950/20 p-4 flex flex-col gap-3">
          <p className="text-sm font-semibold text-white">どのエリアで見る？</p>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:outline-none"
          >
            <option value="">エリア未定</option>
            {sections.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              onClick={() => setExpanded(false)}
              className="flex-1 rounded-lg border border-zinc-700 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleAttend}
              className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-bold text-white hover:bg-red-500 transition-colors flex items-center justify-center gap-1.5"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.859L1.255 2.25H8.08l4.253 5.622L18.244 2.25zM17.083 19.77h1.833L7.084 4.126H5.117L17.083 19.77z"/>
              </svg>
              Xでシェアして登録
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
