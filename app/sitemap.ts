import type { MetadataRoute } from "next";
import { venues } from "./data/venues";
import { events } from "./data/events";
import { readPhotos } from "./lib/photos";

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "https://biewun.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const photos = readPhotos();

  const venueUrls = venues.map((v) => ({
    url: `${BASE}/venue/${v.id}`,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const seatUrls = photos.map((p) => ({
    url: `${BASE}/venue/${p.venueId}/seat/${p.id}`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const eventUrls = events.map((e) => ({
    url: `${BASE}/event/${e.id}`,
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  return [
    { url: BASE, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE}/ranking`, changeFrequency: "daily", priority: 0.7 },
    ...eventUrls,
    ...venueUrls,
    ...seatUrls,
  ];
}
