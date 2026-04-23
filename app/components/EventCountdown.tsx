"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Props {
  eventId: string;
  eventName: string;
  eventDate: string;
  promoter: string;
  posterUrl?: string;
  venueName: string;
  venueId: string;
  mainFight?: { red: string; blue: string };
}

function calcTime(targetDate: string) {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

function Digit({ value, label }: { value: number; label: string }) {
  const [prev, setPrev] = useState(value);
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    if (value !== prev) {
      setFlip(true);
      const t = setTimeout(() => { setFlip(false); setPrev(value); }, 300);
      return () => clearTimeout(t);
    }
  }, [value, prev]);

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`relative w-14 sm:w-20 h-14 sm:h-20 rounded-xl flex items-center justify-center overflow-hidden
          bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-700
          shadow-lg shadow-black/40 ${flip ? "scale-95" : "scale-100"} transition-transform duration-150`}
      >
        {/* 上下の境界線 */}
        <div className="absolute inset-x-0 top-1/2 h-px bg-black/60 z-10" />
        <span className="text-2xl sm:text-4xl font-black text-white tabular-nums z-20">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-xs text-zinc-500 font-medium tracking-widest uppercase">{label}</span>
    </div>
  );
}

export default function EventCountdown({
  eventId, eventName, eventDate, promoter, posterUrl, venueName, venueId, mainFight,
}: Props) {
  const [time, setTime] = useState(() => calcTime(eventDate));

  useEffect(() => {
    const id = setInterval(() => setTime(calcTime(eventDate)), 1000);
    return () => clearInterval(id);
  }, [eventDate]);

  const d = new Date(eventDate);
  const dateLabel = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;

  return (
    <Link href={`/event/${eventId}`} className="block group">
      <div className="relative rounded-2xl overflow-hidden border border-zinc-800 hover:border-red-800/60 transition-colors">
        {/* 背景ポスター */}
        {posterUrl && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={posterUrl}
              alt={eventName}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/60" />
          </>
        )}
        {!posterUrl && (
          <div className="absolute inset-0 bg-gradient-to-br from-red-950/40 via-zinc-950 to-zinc-950" />
        )}

        <div className="relative z-10 p-5 sm:p-7">
          {/* 上部：ラベル＋イベント情報 */}
          <div className="flex items-start justify-between gap-3 mb-5">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-white mb-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                NEXT EVENT
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-white leading-snug">{eventName}</h2>
              <p className="text-xs text-zinc-400 mt-1">{promoter} · {dateLabel} · {venueName}</p>
            </div>
            <span className="shrink-0 text-zinc-400 group-hover:text-white transition-colors text-xl">→</span>
          </div>

          {/* メインファイト */}
          {mainFight && (
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="text-sm sm:text-base font-bold text-white truncate max-w-[120px] sm:max-w-[160px] text-right">
                {mainFight.red}
              </span>
              <span className="shrink-0 text-xs font-black text-red-500 bg-red-950/60 border border-red-800/50 rounded-full px-2.5 py-1">
                VS
              </span>
              <span className="text-sm sm:text-base font-bold text-white truncate max-w-[120px] sm:max-w-[160px]">
                {mainFight.blue}
              </span>
            </div>
          )}

          {/* カウントダウン */}
          {time ? (
            <div className="flex items-end justify-center gap-1.5 sm:gap-3">
              <Digit value={time.days} label="日" />
              <span className="text-xl sm:text-2xl font-black text-zinc-600 mb-4 sm:mb-5">:</span>
              <Digit value={time.hours} label="時間" />
              <span className="text-xl sm:text-2xl font-black text-zinc-600 mb-4 sm:mb-5">:</span>
              <Digit value={time.minutes} label="分" />
              <span className="text-xl sm:text-2xl font-black text-zinc-600 mb-4 sm:mb-5">:</span>
              <Digit value={time.seconds} label="秒" />
            </div>
          ) : (
            <p className="text-center text-red-400 font-black text-xl">🔴 開催中！</p>
          )}

          {/* 下部リンク */}
          <div className="mt-5 flex items-center justify-center gap-3 flex-wrap">
            <span className="rounded-full bg-red-600/80 backdrop-blur-sm border border-red-500/40 px-4 py-1.5 text-xs font-bold text-white group-hover:bg-red-500 transition-colors">
              対戦カード・予想を見る
            </span>
            <Link
              href={`/venue/${venueId}`}
              onClick={(e) => e.stopPropagation()}
              className="rounded-full border border-zinc-600/60 backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-zinc-300 hover:border-zinc-400 hover:text-white transition-colors"
            >
              🪑 座席を確認する
            </Link>
          </div>
        </div>
      </div>
    </Link>
  );
}
