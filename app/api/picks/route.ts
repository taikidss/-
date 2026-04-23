import { NextRequest, NextResponse } from "next/server";

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
  if (!eventId) return NextResponse.json({ error: "eventId required" }, { status: 400 });

  const kv = await getKV();
  if (!kv) return NextResponse.json([]);

  const keys = await kv.keys(`picks:${eventId}:*`);
  const results = await Promise.all(
    keys.map(async (key) => {
      const parts = key.split(":");
      const fightIndex = Number(parts[2]);
      const data = await kv.get<{ red: number; blue: number }>(key) ?? { red: 0, blue: 0 };
      return { fightIndex, ...data };
    })
  );
  return NextResponse.json(results);
}

export async function POST(request: NextRequest) {
  const { eventId, fightIndex, corner } = await request.json();
  if (!eventId || fightIndex === undefined || !corner) {
    return NextResponse.json({ error: "invalid params" }, { status: 400 });
  }

  const kv = await getKV();
  if (!kv) return NextResponse.json({ red: 0, blue: 0 });

  const key = `picks:${eventId}:${fightIndex}`;
  const current = await kv.get<{ red: number; blue: number }>(key) ?? { red: 0, blue: 0 };
  current[corner as "red" | "blue"]++;
  await kv.set(key, current);
  return NextResponse.json({ fightIndex, ...current });
}
