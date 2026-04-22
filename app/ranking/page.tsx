import type { Metadata } from "next";
import Link from "next/link";
import { venues } from "../data/venues";
import { readPhotos } from "../lib/photos";
import { SEAT_TAGS } from "../lib/tags";
import { events, formatDate, daysUntil } from "../data/events";
import StarRating from "../components/StarRating";

export const metadata: Metadata = {
  title: "座席ランキング",
  description: "格闘技ファンが選ぶ！会場別・評価が高い座席TOP5。チケット購入前の参考に。",
};

export default function RankingPage() {
  const photos = readPhotos();
  const today = new Date();

  const venueRankings = venues
    .map((venue) => {
      const rated = photos
        .filter((p) => p.venueId === venue.id && p.rating != null)
        .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

      const upcoming = events
        .filter((e) => e.venueId === venue.id && new Date(e.date) >= today)
        .sort((a, b) => a.date.localeCompare(b.date));

      return { venue, photos: rated.slice(0, 5), upcoming };
    })
    .filter((r) => r.photos.length > 0);

  const rankStyle = (i: number) =>
    i === 0
      ? "bg-yellow-400 text-black"
      : i === 1
      ? "bg-zinc-300 text-black"
      : i === 2
      ? "bg-amber-700 text-white"
      : "bg-zinc-800 text-zinc-400";

  return (
    <div className="min-h-screen">
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold tracking-tight text-white">ビューン</Link>
        <Link
          href="/upload"
          className="rounded-full bg-red-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-500 transition-colors"
        >
          + 写真を投稿
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white">🏆 座席ランキング</h1>
          <p className="text-zinc-500 text-sm mt-1">
            実際に観戦したファンの評価をもとにした会場別ベスト席
          </p>
        </div>

        {venueRankings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-800 p-16 text-center">
            <p className="text-zinc-500">まだ評価付きの写真がありません</p>
            <Link
              href="/upload"
              className="mt-4 inline-block rounded-full bg-red-600 px-5 py-2 text-sm font-bold text-white hover:bg-red-500"
            >
              最初に投稿する
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            {venueRankings.map(({ venue, photos: top, upcoming }) => (
              <section key={venue.id}>
                {/* 会場ヘッダー */}
                <div className="flex items-start justify-between mb-4 gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-white">{venue.name}</h2>
                    {upcoming.length > 0 && (
                      <div className="flex flex-col gap-1 mt-1">
                        {upcoming.slice(0, 2).map((ev) => {
                          const days = daysUntil(ev.date);
                          return (
                            <p key={ev.id} className="text-xs text-red-400 flex items-center gap-1.5">
                              <span className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${
                                days <= 30 ? "bg-red-900/60 text-red-300" : "bg-zinc-800 text-zinc-400"
                              }`}>
                                {days <= 0 ? "開催中" : `あと${days}日`}
                              </span>
                              {ev.name} — {formatDate(ev.date)}
                            </p>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/venue/${venue.id}`}
                    className="shrink-0 text-xs text-zinc-500 hover:text-zinc-300 border border-zinc-800 hover:border-zinc-600 rounded-full px-3 py-1 transition-colors"
                  >
                    全席を見る →
                  </Link>
                </div>

                {/* ランキングリスト */}
                <div className="flex flex-col gap-2">
                  {top.map((photo, i) => {
                    const section = venue.sections.find((s) => s.id === photo.sectionId);
                    return (
                      <Link
                        key={photo.id}
                        href={`/venue/${venue.id}/seat/${photo.id}`}
                        className="group flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-3 hover:border-zinc-600 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/50"
                      >
                        {/* 順位バッジ */}
                        <span className={`shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-xs font-black ${rankStyle(i)}`}>
                          {i + 1}
                        </span>

                        {/* サムネ */}
                        <div className="w-16 h-10 shrink-0 rounded-lg overflow-hidden bg-zinc-800">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photo.photoUrl}
                            alt={photo.seatLabel}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* 情報 */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-white truncate">{photo.seatLabel}</p>
                          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            {section && (
                              <span
                                className="text-xs px-1.5 py-0.5 rounded-full"
                                style={{ color: section.color, background: section.color + "22" }}
                              >
                                {section.name}
                              </span>
                            )}
                            {photo.tags?.slice(0, 1).map((tagId) => {
                              const tag = SEAT_TAGS.find((t) => t.id === tagId);
                              return tag ? (
                                <span key={tagId} className="text-xs text-zinc-500">
                                  {tag.emoji} {tag.label}
                                </span>
                              ) : null;
                            })}
                          </div>
                        </div>

                        {/* 評価 */}
                        <div className="shrink-0">
                          {photo.rating && <StarRating rating={photo.rating} />}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* シェア促進 */}
        <div className="mt-14 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 text-center">
          <p className="text-white font-bold mb-1">あなたの座席写真を追加して</p>
          <p className="text-zinc-500 text-sm mb-4">ランキングをもっと充実させよう</p>
          <Link
            href="/upload"
            className="inline-block rounded-full bg-red-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-red-500 transition-colors"
          >
            写真を投稿する
          </Link>
        </div>
      </main>
    </div>
  );
}
