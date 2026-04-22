"use client";

interface ShareButtonProps {
  venueName: string;
  sectionName?: string;
  seatLabel: string;
  eventName?: string;
  eventDate?: string;
  rating?: number;
}

export default function ShareButton({
  venueName,
  sectionName,
  seatLabel,
  eventName,
  eventDate,
  rating,
}: ShareButtonProps) {
  function handleShare() {
    const stars = rating ? "★".repeat(rating) + "☆".repeat(5 - rating) : null;
    const lines = [
      `📍 ${venueName}${sectionName ? ` / ${sectionName}` : ""} / ${seatLabel}`,
      eventName
        ? `🥊 ${eventName}${eventDate ? `（${eventDate}）` : ""}で観戦予定！`
        : null,
      stars ? `座席評価: ${stars}` : null,
      "",
      `#格闘技観戦 #ビューン`,
      window.location.href,
    ]
      .filter((l) => l !== null)
      .join("\n");

    const url = `https://x.com/intent/post?text=${encodeURIComponent(lines)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 rounded-full bg-sky-950 border border-sky-800 px-4 py-2 text-sm font-semibold text-sky-300 hover:bg-sky-900 hover:text-sky-200 transition-all hover:scale-105 active:scale-95"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.859L1.255 2.25H8.08l4.253 5.622L18.244 2.25zM17.083 19.77h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
      この席で観戦予定をシェア
    </button>
  );
}
