import { NextRequest, NextResponse } from "next/server";

export type Comment = {
  id: string;
  eventId: string;
  fightIndex: number;
  name: string;
  text: string;
  corner: "red" | "blue" | null;
  createdAt: string;
};

async function getKV() {
  try {
    const { kv } = await import("@vercel/kv");
    return kv;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const eventId = request.nextUrl.searchParams.get("eventId");
  if (!eventId) return NextResponse.json([]);

  const kv = await getKV();
  if (!kv) return NextResponse.json([]);

  const key = `comments:${eventId}`;
  const raw = await kv.lrange<string>(key, 0, 99);
  const comments = raw.map((r) => (typeof r === "string" ? JSON.parse(r) : r));
  return NextResponse.json(comments);
}

export async function POST(request: NextRequest) {
  const { eventId, name, text, corner } = await request.json();
  if (!eventId || !name?.trim() || !text?.trim()) {
    return NextResponse.json({ error: "invalid params" }, { status: 400 });
  }

  const comment: Comment = {
    id: crypto.randomUUID(),
    eventId,
    fightIndex: -1,
    name: String(name).slice(0, 20),
    text: String(text).slice(0, 200),
    corner: corner ?? null,
    createdAt: new Date().toISOString(),
  };

  const kv = await getKV();
  if (kv) {
    const key = `comments:${eventId}`;
    await kv.lpush(key, JSON.stringify(comment));
    await kv.ltrim(key, 0, 199);
  }

  return NextResponse.json(comment);
}
