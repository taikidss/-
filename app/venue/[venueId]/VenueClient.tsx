"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import VenueMap from "../../components/VenueMap";
import StarRating from "../../components/StarRating";
import type { Venue } from "../../data/venues";
import type { VenueMapDef } from "../../data/venueMaps";
import type { Photo } from "../../lib/photos";
import { SEAT_TAGS } from "../../lib/tags";
import type { MartialArtsEvent } from "../../data/events";
import { formatDate, daysUntil } from "../../data/events";

interface Props {
  venue: Venue;
  mapDef: VenueMapDef | null;
  photos: Photo[];
  upcomingEvents: MartialArtsEvent[];
  pastEvents: MartialArtsEvent[];
}

export default function VenueClient({ venue, mapDef, photos, upcomingEvents, pastEvents }: Props) {
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    venue.sections[0]?.id ?? null
  );
  const [hasUploaded, setHasUploaded] = useState(false);
  useEffect(() => {
    setHasUploaded(!!localStorage.getItem("biewun_has_uploaded"));
  }, []);

  const selectedSection = venue.sections.find((s) => s.id === selectedSectionId);
  const sectionPhotos = photos.filter((p) => p.sectionId === selectedSectionId);
  const completedSections = venue.sections.filter((s) => photos.some((p) => p.sectionId === s.id)).length;
  const totalSections = venue.sections.length;
  const isComplete = completedSections === totalSections;
  const ratedPhotos = sectionPhotos.filter((p) => p.rating);
  const avgRating = ratedPhotos.length
    ? Math.round((ratedPhotos.reduce((s, p) => s + (p.rating ?? 0), 0) / ratedPhotos.length) * 10) / 10
    : null;

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
      {/* 左: マップ */}
      <div className="lg:w-[400px] shrink-0">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 sm:p-5 lg:sticky lg:top-6">
          <p className="text-xs text-zinc-500 mb-3 text-center tracking-wide uppercase">
            エリアをタップして選択
          </p>
          {/* 完走バッジ */}
          <div className="flex items-center gap-2 mb-3">
            {isComplete ? (
              <span className="flex items-center gap-1.5 text-xs font-bold text-yellow-400">
                🏆 全セクション写真あり！
              </span>
            ) : (
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs text-zinc-600 mb-1">
                  <span>{completedSections}/{totalSections} セクション</span>
                  <span>{Math.round((completedSections / totalSections) * 100)}%</span>
                </div>
                <div className="h-1 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-red-600 transition-all duration-500"
                    style={{ width: `${(completedSections / totalSections) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {venue.seatMapUrl ? (
            <>
              {/* 座席表画像 */}
              <div className="rounded-xl overflow-hidden border border-zinc-800 mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={venue.seatMapUrl}
                  alt={`${venue.name} 座席表`}
                  className="w-full h-auto"
                />
              </div>
              {/* セクションボタン */}
              <div className="flex flex-wrap gap-2 justify-center">
                {venue.sections.map((section) => {
                  const isSelected = section.id === selectedSectionId;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setSelectedSectionId(section.id)}
                      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
                      style={{
                        background: isSelected ? section.color : "transparent",
                        color: isSelected ? "#fff" : section.color,
                        border: `1.5px solid ${section.color}`,
                        opacity: isSelected ? 1 : 0.6,
                        boxShadow: isSelected ? `0 0 14px ${section.color}70` : "none",
                        transform: isSelected ? "scale(1.06)" : undefined,
                      }}
                    >
                      {section.name}
                    </button>
                  );
                })}
              </div>
            </>
          ) : mapDef ? (
            <VenueMap
              mapDef={mapDef}
              selectedSectionId={selectedSectionId}
              onSectionSelect={setSelectedSectionId}
            />
          ) : (
            <div className="h-52 flex items-center justify-center text-zinc-600 text-sm">
              マップ準備中
            </div>
          )}
        </div>

        {/* イベント情報 */}
        {(upcomingEvents.length > 0 || pastEvents.length > 0) && (
          <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3">
              イベント
            </h3>

            {upcomingEvents.length > 0 && (
              <div className="flex flex-col gap-2 mb-3">
                {upcomingEvents.map((ev) => {
                  const days = daysUntil(ev.date);
                  return (
                    <Link key={ev.id} href={`/event/${ev.id}`} className="flex items-start justify-between gap-2 rounded-lg hover:bg-zinc-800/60 transition-colors -mx-1 px-1 py-1">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white leading-snug truncate">{ev.name}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {ev.promoter} · {formatDate(ev.date)}
                        </p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${
                        days <= 30
                          ? "bg-red-900/50 text-red-400"
                          : "bg-zinc-800 text-zinc-400"
                      }`}>
                        {days <= 0 ? "開催中" : `あと${days}日`}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}

            {pastEvents.length > 0 && (
              <div className="flex flex-col gap-1.5 border-t border-zinc-800 pt-3">
                <p className="text-xs text-zinc-600 mb-1">過去のイベント</p>
                {pastEvents.slice(0, 3).map((ev) => (
                  <div key={ev.id} className="flex items-center justify-between gap-2">
                    <p className="text-xs text-zinc-500 truncate">{ev.name}</p>
                    <p className="text-xs text-zinc-700 shrink-0">{formatDate(ev.date)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 右: 写真グリッド */}
      <div className="flex-1 min-w-0">
        {selectedSection && (
          <div key={`header-${selectedSectionId}`} className="animate-fade-slide-in flex flex-wrap items-center gap-2 mb-4">
            {/* セクション名・評価 */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span
                className="shrink-0 inline-block w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: selectedSection.color }}
              />
              <h2 className="font-bold text-white text-base sm:text-lg truncate">{selectedSection.name}</h2>
              {sectionPhotos.length > 0 && (
                <span className="shrink-0 text-sm text-zinc-500">{sectionPhotos.length}件</span>
              )}
              {avgRating && (
                <span className="shrink-0 flex items-center gap-1 text-sm text-yellow-400 font-semibold">
                  ★ {avgRating}
                </span>
              )}
            </div>
            {/* アクションボタン */}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`https://x.com/search?q=${encodeURIComponent(`${venue.name} ${selectedSection.name}`)}&f=image`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:border-sky-500 hover:text-sky-400 transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.859L1.255 2.25H8.08l4.253 5.622L18.244 2.25zM17.083 19.77h1.833L7.084 4.126H5.117L17.083 19.77z"/>
                </svg>
                <span className="hidden xs:inline">Xで検索</span>
              </a>
              <Link
                href={`/upload?venue=${venue.id}&section=${selectedSectionId}`}
                className="rounded-full border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-colors"
              >
                + 投稿
              </Link>
            </div>
          </div>
        )}

        {/* 未投稿ゲート */}
        {!hasUploaded && sectionPhotos.length > 0 && (
          <div className="relative">
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 select-none pointer-events-none">
              {sectionPhotos.slice(0, 3).map((photo) => (
                <div key={photo.id} className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 aspect-video">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.photoUrl}
                    alt=""
                    className="w-full h-full object-cover blur-md scale-105 brightness-50"
                  />
                </div>
              ))}
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <div className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-2xl p-6 max-w-xs w-full">
                <p className="text-2xl mb-2">📷</p>
                <p className="font-bold text-white text-sm mb-1">写真を投稿して閲覧解放</p>
                <p className="text-xs text-zinc-400 mb-4">
                  1枚投稿するだけで、全会場の全座席写真が見放題になります
                </p>
                <Link
                  href={`/upload?venue=${venue.id}&section=${selectedSectionId ?? ""}`}
                  className="block rounded-full bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-500 transition-colors"
                >
                  写真を投稿する
                </Link>
              </div>
            </div>
          </div>
        )}

        {sectionPhotos.length === 0 ? (
          <div key={`empty-${selectedSectionId}`} className="animate-fade-slide-in rounded-2xl border border-dashed border-zinc-800 p-10 sm:p-12 text-center">
            <div className="text-4xl mb-3">📷</div>
            <p className="text-zinc-400 font-medium mb-1">まだ写真がありません</p>
            <p className="text-zinc-600 text-sm mb-5">
              このブロックの座席写真を最初に投稿しよう
            </p>
            <Link
              href={`/upload?venue=${venue.id}&section=${selectedSectionId ?? ""}`}
              className="inline-block rounded-full bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-500 transition-colors"
            >
              写真を投稿する
            </Link>
          </div>
        ) : hasUploaded ? (
          <div key={`grid-${selectedSectionId}`} className="animate-fade-slide-in grid gap-3 grid-cols-2 sm:grid-cols-3">
            {sectionPhotos.map((photo, idx) => (
              <Link
                key={photo.id}
                href={`/venue/${venue.id}/seat/${photo.id}`}
                className="animate-pop-in group block rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 hover:border-zinc-600 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/60"
                style={{ animationDelay: `${idx * 40}ms`, opacity: 0 }}
              >
                <div className="relative aspect-video overflow-hidden bg-zinc-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.photoUrl}
                    alt={photo.seatLabel}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {photo.photoType === "panorama" && (
                    <span className="absolute top-2 left-2 rounded-full bg-black/70 backdrop-blur-sm px-2 py-0.5 text-xs font-medium text-white">
                      360°
                    </span>
                  )}
                  {photo.photoType === "video" && (
                    <span className="absolute top-2 left-2 rounded-full bg-black/70 backdrop-blur-sm px-2 py-0.5 text-xs font-medium text-white">
                      🎬
                    </span>
                  )}
                </div>
                <div className="p-2.5 sm:p-3">
                  <p className="font-semibold text-xs sm:text-sm text-white truncate">{photo.seatLabel}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {photo.rating && <StarRating rating={photo.rating} />}
                    {photo.event && (
                      <p className="text-xs text-zinc-500 truncate">{photo.event}</p>
                    )}
                  </div>
                  {photo.tags && photo.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {photo.tags.slice(0, 2).map((tagId) => {
                        const tag = SEAT_TAGS.find((t) => t.id === tagId);
                        return tag ? (
                          <span key={tagId} className="text-xs text-zinc-400">
                            {tag.emoji} {tag.label}
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </Link>
            ))}

            {/* 投稿促進カード */}
            <Link
              href={`/upload?venue=${venue.id}&section=${selectedSectionId ?? ""}`}
              className="group flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/50 p-4 text-center hover:border-zinc-600 transition-colors aspect-video"
            >
              <span className="text-2xl mb-1">+</span>
              <span className="text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors">
                写真を追加
              </span>
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
