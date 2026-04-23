import { NextRequest, NextResponse } from "next/server";

export type UserDreamMatch = {
  id: string;
  category: "RIZIN" | "ONE" | "BOXING";
  fighter1: string;
  fighter2: string;
  weightClass: string;
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

export async function GET() {
  const kv = await getKV();
  if (!kv) return NextResponse.json([]);

  const raw = await kv.lrange<string>("user-dream-matches", 0, 99);
  const matches = raw.map((r) => (typeof r === "string" ? JSON.parse(r) : r));
  return NextResponse.json(matches);
}

export async function POST(request: NextRequest) {
  const { category, fighter1, fighter2, weightClass } = await request.json();
  if (!category || !fighter1?.trim() || !fighter2?.trim() || !weightClass?.trim()) {
    return NextResponse.json({ error: "invalid params" }, { status: 400 });
  }

  const match: UserDreamMatch = {
    id: `user-${crypto.randomUUID()}`,
    category,
    fighter1: String(fighter1).slice(0, 30),
    fighter2: String(fighter2).slice(0, 30),
    weightClass: String(weightClass).slice(0, 20),
    createdAt: new Date().toISOString(),
  };

  const kv = await getKV();
  if (kv) {
    await kv.lpush("user-dream-matches", JSON.stringify(match));
    await kv.ltrim("user-dream-matches", 0, 199);
  }

  return NextResponse.json(match);
}
