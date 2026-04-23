import { NextRequest, NextResponse } from "next/server";
import { readPicks, addPick } from "../../lib/picks";

export async function GET(request: NextRequest) {
  const eventId = request.nextUrl.searchParams.get("eventId");
  if (!eventId) return NextResponse.json({ error: "eventId required" }, { status: 400 });
  const picks = readPicks().filter((p) => p.eventId === eventId);
  return NextResponse.json(picks);
}

export async function POST(request: NextRequest) {
  const { eventId, fightIndex, corner } = await request.json();
  if (!eventId || fightIndex === undefined || !corner) {
    return NextResponse.json({ error: "invalid params" }, { status: 400 });
  }
  const entry = addPick(eventId, fightIndex, corner);
  return NextResponse.json(entry);
}
