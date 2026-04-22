"use client";

interface CheckInButtonProps {
  venueName: string;
  sectionName?: string;
  seatLabel: string;
  eventName?: string;
}

export default function CheckInButton({ venueName, sectionName, seatLabel, eventName }: CheckInButtonProps) {
  function handleCheckIn() {
    const lines = [
      "🔴 LIVE 観戦中！",
      `📍 ${venueName}${sectionName ? ` / ${sectionName}` : ""} / ${seatLabel}`,
      eventName ? `🥊 ${eventName}` : null,
      "",
      "#格闘技観戦 #ビューン",
      window.location.href,
    ]
      .filter((l) => l !== null)
      .join("\n");

    window.open(
      `https://x.com/intent/post?text=${encodeURIComponent(lines)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <button
      onClick={handleCheckIn}
      className="flex items-center gap-2 rounded-full bg-red-950 border border-red-800 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-900 hover:text-red-200 transition-all hover:scale-105 active:scale-95"
    >
      <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
      観戦中をシェア
    </button>
  );
}
