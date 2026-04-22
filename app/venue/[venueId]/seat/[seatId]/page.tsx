import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { venues } from "../../../../data/venues";
import { readPhotos } from "../../../../lib/photos";
import { SEAT_TAGS } from "../../../../lib/tags";
import { getUpcomingEvents, formatDate } from "../../../../data/events";
import PhotoViewer from "../../../../components/PhotoViewer";
import StarRating from "../../../../components/StarRating";
import ShareButton from "../../../../components/ShareButton";
import CheckInButton from "../../../../components/CheckInButton";

interface Props {
  params: Promise<{ venueId: string; seatId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { venueId, seatId } = await params;
  const venue = venues.find((v) => v.id === venueId);
  const photo = readPhotos().find((p) => p.id === seatId && p.venueId === venueId);
  if (!venue || !photo) return {};

  const section = venue.sections.find((s) => s.id === photo.sectionId);
  const ratingLabels = ["", "悪い", "やや悪い", "普通", "良い", "最高"];
  const parts = [
    section?.name,
    photo.rating ? `★${photo.rating} ${ratingLabels[photo.rating]}` : null,
    photo.event,
  ].filter(Boolean);

  const title = `${photo.seatLabel} | ${venue.name}`;
  const description = parts.join(" · ") || `${venue.name}の座席ビュー`;
  const ogImageUrl = `/api/og?venueId=${venueId}&seatId=${seatId}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: photo.seatLabel }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImageUrl] },
  };
}

export default async function SeatPage({ params }: Props) {
  const { venueId, seatId } = await params;

  const venue = venues.find((v) => v.id === venueId);
  if (!venue) notFound();

  const photo = readPhotos().find((p) => p.id === seatId && p.venueId === venueId);
  if (!photo) notFound();

  const section = venue.sections.find((s) => s.id === photo.sectionId);
  const nextEvent = getUpcomingEvents(venueId)[0];

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 w-full">
      <div className="mb-2 flex items-center gap-2 text-sm text-gray-500 flex-wrap">
        <Link href="/" className="hover:text-gray-300">トップ</Link>
        <span>/</span>
        <Link href={`/venue/${venueId}`} className="hover:text-gray-300">{venue.name}</Link>
        <span>/</span>
        <span className="text-gray-300">{photo.seatLabel}</span>
      </div>

      <div className="mt-6 rounded-xl overflow-hidden h-[260px] sm:h-[420px] lg:h-[500px]">
        <PhotoViewer
          photoUrl={photo.photoUrl}
          photoType={photo.photoType}
          title={photo.seatLabel}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-4 items-start justify-between">
        <div>
          <h1 className="text-xl font-bold">{photo.seatLabel}</h1>
          <p className="text-gray-400 text-sm mt-1">
            {venue.name}
            {photo.event && <> · {photo.event}</>}
            {" · "}{photo.uploadedAt}
          </p>
          {photo.rating && (
            <div className="flex items-center gap-2 mt-2">
              <StarRating rating={photo.rating} size="lg" />
              <span className="text-zinc-400 text-sm">
                {["", "悪い", "やや悪い", "普通", "良い", "最高"][photo.rating]}
              </span>
            </div>
          )}
        </div>
        {section && (
          <span
            className="rounded-full px-3 py-1 text-sm font-medium"
            style={{
              backgroundColor: section.color + "22",
              color: section.color,
              border: `1px solid ${section.color}44`,
            }}
          >
            {section.name}
          </span>
        )}
      </div>

      {photo.tags && photo.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {photo.tags.map((tagId) => {
            const tag = SEAT_TAGS.find((t) => t.id === tagId);
            return tag ? (
              <span
                key={tagId}
                className="flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-300"
              >
                {tag.emoji} {tag.label}
              </span>
            ) : null;
          })}
        </div>
      )}

      {photo.photoType === "panorama" && (
        <div className="mt-4 rounded-lg bg-gray-900 border border-gray-800 p-4 text-sm text-gray-400">
          ドラッグで視点を動かせます。スクロールでズームできます。
        </div>
      )}

      {/* アクションボタン群 */}
      <div className="mt-4 flex flex-wrap gap-2">
        <CheckInButton
          venueName={venue.name}
          sectionName={section?.name}
          seatLabel={photo.seatLabel}
          eventName={nextEvent?.name}
        />
        <Link
          href={`/compare?a=${photo.id}`}
          className="flex items-center gap-2 rounded-full border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-all hover:scale-105 active:scale-95"
        >
          ⇄ 他の席と比較する
        </Link>
      </div>

      {/* 観戦予定シェア */}
      <div className="mt-4 rounded-xl border border-sky-900/50 bg-sky-950/30 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-sky-300">この席で観戦予定ですか？</p>
          <p className="text-xs text-zinc-500 mt-0.5">
            {nextEvent
              ? `次回イベント: ${nextEvent.name}（${formatDate(nextEvent.date)}）`
              : `${venue.name} · ${section?.name ?? ""} · ${photo.seatLabel}`}
          </p>
        </div>
        <ShareButton
          venueName={venue.name}
          sectionName={section?.name}
          seatLabel={photo.seatLabel}
          eventName={nextEvent?.name}
          eventDate={nextEvent ? formatDate(nextEvent.date) : undefined}
          rating={photo.rating}
        />
      </div>

      {/* Xで検索 */}
      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-zinc-300">この座席の写真をXで探す</p>
          <p className="text-xs text-zinc-500 mt-0.5">
            {venue.name} · {section?.name} · {photo.seatLabel}
          </p>
        </div>
        <a
          href={`https://x.com/search?q=${encodeURIComponent(`${venue.name} ${section?.name ?? ""} ${photo.seatLabel}`)}&f=image`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-2 rounded-full bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-sky-950 hover:text-sky-400 hover:border-sky-800 border border-zinc-700 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.859L1.255 2.25H8.08l4.253 5.622L18.244 2.25zM17.083 19.77h1.833L7.084 4.126H5.117L17.083 19.77z"/>
          </svg>
          Xで検索
        </a>
      </div>
    </main>
  );
}
