import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { addPhoto, type Photo } from "../../lib/photos";

const MAX_SIZE = 20 * 1024 * 1024; // 20MB

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const file = formData.get("file") as File | null;
  const venueId = formData.get("venueId") as string;
  const sectionId = formData.get("sectionId") as string;
  const seatLabel = formData.get("seatLabel") as string;
  const photoType = formData.get("photoType") as "panorama" | "flat";
  const event = (formData.get("event") as string) || undefined;
  const ratingRaw = formData.get("rating") as string | null;
  const tagsRaw = formData.get("tags") as string | null;
  const rating = ratingRaw ? Number(ratingRaw) : undefined;
  const tags = tagsRaw ? JSON.parse(tagsRaw) : undefined;

  if (!file || !venueId || !sectionId || !seatLabel || !photoType) {
    return NextResponse.json({ error: "必須項目が足りません" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "ファイルサイズは20MB以下にしてください" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
  const id = crypto.randomUUID();
  const filename = `${id}.${ext}`;

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  fs.mkdirSync(uploadsDir, { recursive: true });
  fs.writeFileSync(path.join(uploadsDir, filename), buffer);

  const photo: Photo = {
    id,
    venueId,
    sectionId,
    seatLabel,
    photoUrl: `/uploads/${filename}`,
    photoType,
    event,
    rating,
    tags,
    uploadedAt: new Date().toISOString().split("T")[0],
  };

  addPhoto(photo);

  return NextResponse.json({ photo });
}
