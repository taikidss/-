import type { Metadata } from "next";
import Link from "next/link";
import { readPhotos } from "../lib/photos";
import { venues } from "../data/venues";
import { SEAT_TAGS } from "../lib/tags";
import StarRating from "../components/StarRating";

export const metadata: Metadata = {
  title: "座席比較",
  description: "2つの座席を並べて比較。どっちの席にする？",
};

interface Props {
  searchParams: Promise<{ a?: string; b?: string }>;
}

export default async function ComparePage({ searchParams }: Props) {
  const { a, b } = await searchParams;
  const photos = readPhotos();

  const photoA = a ? photos.find((p) => p.id === a) : null;
  const photoB = b ? photos.find((p) => p.id === b) : null;

  const getVenueSection = (photo: (typeof photos)[0]) => {
    const venue = venues.find((v) => v.id === photo.venueId);
    const section = venue?.sections.find((s) => s.id === photo.sectionId);
    return { venue, section };
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold tracking-tight text-white">ビューン</Link>
        <span className="text-sm text-zinc-500">座席比較</span>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-black text-white">⇄ 座席比較</h1>
          <p className="text-zinc-500 text-sm mt-1">2つの席を並べて比較しよう</p>
        </div>

        {photoA && photoB ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SeatCard photoId={a!} />
              <SeatCard photoId={b!} />
            </div>

            {/* シェアボタン */}
            <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900 p-4 flex items-center justify-between gap-3 flex-wrap">
              <p className="text-sm text-zinc-400">この比較をシェアする</p>
              <a
                href={`https://x.com/intent/post?text=${encodeURIComponent(
                  `座席比較してみた！\n${(photoA ? getVenueSection(photoA).venue?.name : "")} ${photoA?.seatLabel} vs ${photoB?.seatLabel}\n\n#格闘技観戦 #ビューン\n` +
                  (typeof window !== "undefined" ? window.location.href : "")
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full bg-zinc-800 border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-sky-950 hover:text-sky-300 hover:border-sky-800 transition-colors"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.859L1.255 2.25H8.08l4.253 5.622L18.244 2.25zM17.083 19.77h1.833L7.084 4.126H5.117L17.083 19.77z" />
                </svg>
                Xでシェア
              </a>
            </div>
          </>
        ) : photoA ? (
          <PickSecond fixedPhotoId={a!} photos={photos} />
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-800 p-12 text-center">
            <p className="text-zinc-500">比較する座席が選択されていません</p>
            <Link href="/" className="mt-4 inline-block text-sm text-zinc-400 hover:text-white">
              ← 会場一覧へ
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

function SeatCard({ photoId }: { photoId: string }) {
  const photos = readPhotos();
  const photo = photos.find((p) => p.id === photoId);
  if (!photo) return null;

  const venue = venues.find((v) => v.id === photo.venueId);
  const section = venue?.sections.find((s) => s.id === photo.sectionId);

  return (
    <div className="rounded-2xl border border-zinc-700 bg-zinc-900 overflow-hidden">
      <div className="aspect-video bg-zinc-800 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.photoUrl} alt={photo.seatLabel} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h2 className="text-lg font-black text-white">{photo.seatLabel}</h2>
          {section && (
            <span
              className="shrink-0 text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ color: section.color, background: section.color + "22" }}
            >
              {section.name}
            </span>
          )}
        </div>
        <p className="text-xs text-zinc-500 mb-3">{venue?.name}</p>
        {photo.rating && (
          <div className="flex items-center gap-2 mb-3">
            <StarRating rating={photo.rating} />
            <span className="text-xs text-zinc-400">
              {["", "悪い", "やや悪い", "普通", "良い", "最高"][photo.rating]}
            </span>
          </div>
        )}
        {photo.tags && photo.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {photo.tags.map((tagId) => {
              const tag = SEAT_TAGS.find((t) => t.id === tagId);
              return tag ? (
                <span key={tagId} className="text-xs rounded-full border border-zinc-700 px-2 py-0.5 text-zinc-400">
                  {tag.emoji} {tag.label}
                </span>
              ) : null;
            })}
          </div>
        )}
        <Link
          href={`/venue/${photo.venueId}/seat/${photo.id}`}
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          詳細を見る →
        </Link>
      </div>
    </div>
  );
}

function PickSecond({
  fixedPhotoId,
  photos,
}: {
  fixedPhotoId: string;
  photos: ReturnType<typeof readPhotos>;
}) {
  const fixed = photos.find((p) => p.id === fixedPhotoId);
  if (!fixed) return null;

  const sameVenuePhotos = photos
    .filter((p) => p.venueId === fixed.venueId && p.id !== fixedPhotoId)
    .slice(0, 12);

  const venue = venues.find((v) => v.id === fixed.venueId);

  return (
    <div>
      <div className="rounded-xl border border-sky-900/50 bg-sky-950/20 p-4 mb-6">
        <p className="text-sm text-sky-300 font-medium">
          「{fixed.seatLabel}」と比較する席を選んでください
        </p>
        <p className="text-xs text-zinc-500 mt-1">{venue?.name}</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {sameVenuePhotos.map((photo) => {
          const section = venue?.sections.find((s) => s.id === photo.sectionId);
          return (
            <Link
              key={photo.id}
              href={`/compare?a=${fixedPhotoId}&b=${photo.id}`}
              className="group rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden hover:border-zinc-600 transition-all hover:-translate-y-0.5"
            >
              <div className="aspect-video bg-zinc-800 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.photoUrl}
                  alt={photo.seatLabel}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-2.5">
                <p className="text-xs font-semibold text-white truncate">{photo.seatLabel}</p>
                {section && (
                  <p className="text-xs mt-0.5" style={{ color: section.color }}>{section.name}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
