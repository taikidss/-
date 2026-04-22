import { ImageResponse } from "next/og";
import { readPhotos } from "../../lib/photos";
import { venues } from "../../data/venues";
import { events } from "../../data/events";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const seatId = searchParams.get("seatId");
  const venueId = searchParams.get("venueId");

  if (!seatId || !venueId) return new Response("Missing params", { status: 400 });

  const photo = readPhotos().find((p) => p.id === seatId && p.venueId === venueId);
  const venue = venues.find((v) => v.id === venueId);
  if (!photo || !venue) return new Response("Not found", { status: 404 });

  const section = venue.sections.find((s) => s.id === photo.sectionId);
  const today = new Date();
  const nextEvent = events
    .filter((e) => e.venueId === venueId && new Date(e.date) >= today)
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  const isRealPhoto = photo.photoUrl.startsWith("/uploads/");
  const photoSrc = isRealPhoto ? `${origin}${photo.photoUrl}` : null;
  const stars = photo.rating ? "★".repeat(photo.rating) + "☆".repeat(5 - photo.rating) : null;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #09090b 0%, #18181b 60%, #09090b 100%)",
          padding: "48px 60px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* 背景アクセント */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          background: section
            ? `radial-gradient(ellipse at 70% 50%, ${section.color}18 0%, transparent 60%)`
            : "none",
          display: "flex",
        }} />

        {/* ヘッダー */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "36px" }}>
          <span style={{ fontSize: 26, fontWeight: 900, color: "white", letterSpacing: "-1px" }}>
            🪑 ビューン
          </span>
          {nextEvent && (
            <span style={{
              fontSize: 16, color: "#fca5a5",
              background: "#450a0a", padding: "6px 18px",
              borderRadius: 99, border: "1px solid #7f1d1d",
            }}>
              {nextEvent.name}
            </span>
          )}
        </div>

        {/* メイン */}
        <div style={{ display: "flex", gap: "44px", flex: 1, alignItems: "center" }}>
          {/* 写真 */}
          <div style={{
            width: 460, height: 306,
            borderRadius: 20, overflow: "hidden",
            background: "#27272a",
            border: "2px solid #3f3f46",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            {photoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoSrc} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
            ) : (
              <span style={{ fontSize: 72, opacity: 0.3 }}>📷</span>
            )}
          </div>

          {/* テキスト情報 */}
          <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: "12px" }}>
            <span style={{ fontSize: 15, color: "#71717a" }}>{venue.name}</span>
            {section && (
              <span style={{
                fontSize: 17, fontWeight: 700,
                color: section.color,
                background: section.color + "22",
                padding: "4px 14px",
                borderRadius: 99,
                alignSelf: "flex-start",
                border: `1px solid ${section.color}44`,
              }}>
                {section.name}
              </span>
            )}
            <span style={{ fontSize: 50, fontWeight: 900, color: "white", lineHeight: 1.05 }}>
              {photo.seatLabel}
            </span>
            {stars && (
              <span style={{ fontSize: 34, color: "#fbbf24", letterSpacing: "3px" }}>
                {stars}
              </span>
            )}
            {photo.event && (
              <span style={{ fontSize: 15, color: "#52525b" }}>{photo.event}</span>
            )}
          </div>
        </div>

        {/* フッター */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
          <span style={{ fontSize: 13, color: "#3f3f46" }}>
            チケットを買う前に座席ビューを確認しよう
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
