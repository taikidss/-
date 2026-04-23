import { NextRequest, NextResponse } from "next/server";

async function getKV() {
  try {
    const { kv } = await import("@vercel/kv");
    return kv;
  } catch {
    return null;
  }
}

export async function GET() {
  const kv = await getKV();
  if (!kv) return NextResponse.json({});

  const keys = await kv.keys("dream-vote:*");
  if (keys.length === 0) return NextResponse.json({});

  const entries = await Promise.all(
    keys.map(async (key) => {
      const matchId = key.replace("dream-vote:", "");
      const count = (await kv.get<number>(key)) ?? 0;
      return [matchId, count] as [string, number];
    })
  );

  return NextResponse.json(Object.fromEntries(entries));
}

export async function POST(request: NextRequest) {
  const { matchId } = await request.json();
  if (!matchId) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const kv = await getKV();
  if (!kv) return NextResponse.json({ count: 1 });

  const key = `dream-vote:${matchId}`;
  const count = await kv.incr(key);
  return NextResponse.json({ matchId, count });
}
