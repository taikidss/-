import fs from "fs";
import path from "path";
export { SEAT_TAGS, type TagId } from "./tags";
import type { TagId } from "./tags";

const PHOTOS_FILE = path.join(process.cwd(), "data", "photos.json");

export type Photo = {
  id: string;
  venueId: string;
  sectionId: string;
  seatLabel: string;
  photoUrl: string;
  photoType: "panorama" | "flat";
  event?: string;
  uploadedAt: string;
  rating?: number;
  tags?: TagId[];
};

export function readPhotos(): Photo[] {
  try {
    return JSON.parse(fs.readFileSync(PHOTOS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

export function addPhoto(photo: Photo): void {
  const photos = readPhotos();
  photos.unshift(photo);
  fs.writeFileSync(PHOTOS_FILE, JSON.stringify(photos, null, 2));
}
