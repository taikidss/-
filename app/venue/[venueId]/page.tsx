import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { venues } from "../../data/venues";
import { venueMaps } from "../../data/venueMaps";
import { readPhotos } from "../../lib/photos";
import { getUpcomingEvents, getPastEvents } from "../../data/events";
import VenueClient from "./VenueClient";

interface Props {
  params: Promise<{ venueId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { venueId } = await params;
  const venue = venues.find((v) => v.id === venueId);
  if (!venue) return {};
  const count = readPhotos().filter((p) => p.venueId === venueId).length;
  const title = `${venue.name} 座席ビュー`;
  const description = `${venue.name}の${count}件の座席写真。実際の眺めを確認してチケットを賢く選ぼう。`;
  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: venue.coverImage }] },
    twitter: { title, description, images: [venue.coverImage] },
  };
}

export default async function VenuePage({ params }: Props) {
  const { venueId } = await params;
  const venue = venues.find((v) => v.id === venueId);
  if (!venue) notFound();

  const mapDef = venueMaps[venueId] ?? null;
  const photos = readPhotos().filter((p) => p.venueId === venueId);
  const upcomingEvents = getUpcomingEvents(venueId);
  const pastEvents = getPastEvents(venueId);

  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold tracking-tight text-white">ビューン</Link>
        <Link
          href={`/upload?venue=${venueId}`}
          className="rounded-full bg-red-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-500 transition-colors"
        >
          + 写真を投稿
        </Link>
      </header>

      {/* 会場ヒーロー */}
      <div className="relative h-48 sm:h-60 overflow-hidden bg-zinc-900">
        <Image
          src={venue.coverImage}
          alt={venue.name}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
        <div className="absolute bottom-0 left-0 px-6 py-5 max-w-5xl w-full mx-auto">
          <Link href="/" className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors">
            ← 会場一覧
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">{venue.name}</h1>
          <p className="text-zinc-400 text-sm mt-0.5">{photos.length}件の座席写真</p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <VenueClient
          venue={venue}
          mapDef={mapDef}
          photos={photos}
          upcomingEvents={upcomingEvents}
          pastEvents={pastEvents}
        />
      </main>
    </div>
  );
}
