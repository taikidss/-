import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { events, formatDate, daysUntil } from "../../data/events";
import { venues } from "../../data/venues";
import { getFightCard } from "../../data/fightCards";
import { readPhotos } from "../../lib/photos";
import FightPicks from "../../components/FightPicks";
import AttendButton from "../../components/AttendButton";
import CommentSection from "../../components/CommentSection";

interface Props {
  params: Promise<{ eventId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { eventId } = await params;
  const event = events.find((e) => e.id === eventId);
  if (!event) return {};
  const card = getFightCard(eventId);
  const main = card?.fights.find((f) => f.isMain);
  const description = main
    ? `メイン: ${main.redCorner.name} vs ${main.blueCorner.name} | ${formatDate(event.date)}`
    : `${event.promoter} · ${formatDate(event.date)}`;
  return {
    title: event.name,
    description,
    openGraph: { title: event.name, description },
    twitter: { title: event.name, description },
  };
}

export default async function EventPage({ params }: Props) {
  const { eventId } = await params;
  const event = events.find((e) => e.id === eventId);
  if (!event) notFound();

  const venue = venues.find((v) => v.id === event.venueId);
  const card = getFightCard(eventId);
  const photos = readPhotos().filter((p) => p.venueId === event.venueId);
  const days = daysUntil(event.date);
  const isPast = days < 0;

  const mainFight = card?.fights.find((f) => f.isMain);
  const undercard = card?.fights.filter((f) => !f.isMain) ?? [];

  return (
    <div className="min-h-screen">
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold tracking-tight text-white">ビューン</Link>
        {venue && (
          <Link
            href={`/venue/${venue.id}`}
            className="rounded-full border border-zinc-700 px-4 py-1.5 text-sm font-medium text-zinc-300 hover:border-zinc-500 transition-colors"
          >
            座席を見る
          </Link>
        )}
      </header>

      <main className="max-w-2xl mx-auto px-5 py-8">
        {/* パンくず */}
        <div className="flex items-center gap-2 text-xs text-zinc-600 mb-6 flex-wrap">
          <Link href="/" className="hover:text-zinc-400">トップ</Link>
          <span>/</span>
          {venue && (
            <>
              <Link href={`/venue/${venue.id}`} className="hover:text-zinc-400">{venue.name}</Link>
              <span>/</span>
            </>
          )}
          <span className="text-zinc-400">{event.name}</span>
        </div>

        {/* イベントヘッダー */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden mb-6">
          {/* ポスター画像 */}
          {event.posterUrl && (
            <div className="relative w-full aspect-video bg-zinc-800">
              <Image
                src={event.posterUrl}
                alt={event.name}
                fill
                className="object-cover"
                sizes="(max-width: 672px) 100vw, 672px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <span className={`absolute top-3 right-3 rounded-full px-3 py-1 text-sm font-bold backdrop-blur-sm ${
                isPast
                  ? "bg-black/60 text-zinc-400"
                  : days <= 14
                  ? "bg-red-900/80 text-red-200"
                  : "bg-black/60 text-zinc-200"
              }`}>
                {isPast ? "終了" : days === 0 ? "本日開催" : `あと${days}日`}
              </span>
            </div>
          )}

          <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p className="text-xs text-zinc-500 mb-1">{event.promoter}</p>
              <h1 className="text-xl sm:text-2xl font-black text-white leading-snug">{event.name}</h1>
              <p className="text-sm text-zinc-400 mt-1.5">
                📅 {formatDate(event.date)}
                {venue && <> &nbsp;·&nbsp; 📍 {venue.name}</>}
              </p>
            </div>
            {!event.posterUrl && (
              <span className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${
                isPast
                  ? "bg-zinc-800 text-zinc-500"
                  : days <= 14
                  ? "bg-red-900/60 text-red-300"
                  : "bg-zinc-800 text-zinc-300"
              }`}>
                {isPast ? "終了" : days === 0 ? "本日開催" : `あと${days}日`}
              </span>
            )}
          </div>

          {/* 参戦登録 */}
          {!isPast && venue && (
            <AttendButton
              eventId={eventId}
              eventName={event.name}
              eventDate={formatDate(event.date)}
              venueName={venue.name}
              sections={venue.sections}
            />
          )}

          {/* 座席へのリンク */}
          {venue && photos.length > 0 && (
            <Link
              href={`/venue/${venue.id}`}
              className="mt-4 flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm font-medium text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors"
            >
              <span className="text-base">🪑</span>
              <div>
                <p className="font-semibold">{venue.name}の座席から見える景色を確認</p>
                <p className="text-xs text-zinc-500 mt-0.5">{photos.length}件の座席写真</p>
              </div>
              <span className="ml-auto text-zinc-600">→</span>
            </Link>
          )}
          </div>
        </div>

        {/* 対戦カード */}
        {card ? (
          <div>
            <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-3">対戦カード</h2>

            <div className="flex flex-col gap-3">
              {/* メインイベント */}
              {mainFight && (
                <div className="rounded-2xl border border-red-900/50 bg-gradient-to-b from-red-950/30 to-zinc-900 p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-bold text-white">
                      MAIN EVENT
                    </span>
                    {mainFight.isTitleMatch && (
                      <span className="rounded-full bg-yellow-500/20 border border-yellow-500/40 px-2.5 py-0.5 text-xs font-bold text-yellow-400">
                        🏆 タイトルマッチ
                      </span>
                    )}
                  </div>

                  {mainFight.titleName && (
                    <p className="text-xs text-yellow-500/80 mb-3 font-medium">{mainFight.titleName}</p>
                  )}

                  <FightRow fight={mainFight} large />

                  {mainFight.note && (
                    <p className="mt-3 text-xs text-zinc-500 border-t border-zinc-800 pt-2">{mainFight.note}</p>
                  )}
                </div>
              )}

              {/* アンダーカード */}
              {undercard.length > 0 && (
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
                  <p className="text-xs font-semibold text-zinc-600 uppercase tracking-wide px-4 py-2.5 border-b border-zinc-800">
                    アンダーカード
                  </p>
                  <div className="divide-y divide-zinc-800">
                    {undercard.map((fight, i) => (
                      <div key={i} className="px-4 py-3">
                        {fight.isTitleMatch && (
                          <span className="inline-block rounded-full bg-yellow-500/15 border border-yellow-500/30 px-2 py-0.5 text-xs font-bold text-yellow-500 mb-2">
                            🏆 {fight.titleName ?? "タイトルマッチ"}
                          </span>
                        )}
                        <FightRow fight={fight} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-zinc-800 p-8 text-center">
            <p className="text-zinc-500 text-sm">対戦カードは近日公開予定</p>
          </div>
        )}

        {/* 試合予想 */}
        {card && (
          <FightPicks
            eventId={eventId}
            eventName={event.name}
            fights={card.fights}
            isPast={isPast}
          />
        )}

        {/* 大会コメント欄 */}
        <CommentSection eventId={eventId} />

        {/* シェアボタン */}
        <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900 p-4 flex items-center justify-between gap-3 flex-wrap">
          <p className="text-sm text-zinc-400">この大会情報をシェア</p>
          <a
            href={`https://x.com/intent/post?text=${encodeURIComponent(
              `${event.name}\n📅 ${formatDate(event.date)}${venue ? `\n📍 ${venue.name}` : ""}\n\n#格闘技観戦 #ビューン`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-zinc-800 border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-sky-950 hover:text-sky-300 hover:border-sky-800 transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.859L1.255 2.25H8.08l4.253 5.622L18.244 2.25zM17.083 19.77h1.833L7.084 4.126H5.117L17.083 19.77z"/>
            </svg>
            Xでシェア
          </a>
        </div>
      </main>
    </div>
  );
}

function FightRow({ fight, large }: { fight: import("../../data/fightCards").Fight; large?: boolean }) {
  const isCancelled = fight.status === "cancelled";
  const isChanged = fight.status === "changed";

  return (
    <div className={`flex flex-col gap-2 ${isCancelled ? "opacity-60" : ""}`}>
      {/* ステータスバッジ */}
      {isCancelled && (
        <div className="flex items-center gap-2 rounded-lg bg-orange-950/60 border border-orange-800/50 px-3 py-1.5">
          <span className="text-sm">⚠️</span>
          <p className="text-xs font-bold text-orange-400">
            試合中止{fight.statusNote ? `：${fight.statusNote}` : ""}
          </p>
        </div>
      )}
      {isChanged && (
        <div className="flex items-center gap-2 rounded-lg bg-yellow-950/60 border border-yellow-800/50 px-3 py-1.5">
          <span className="text-sm">🔄</span>
          <p className="text-xs font-bold text-yellow-400">
            変更あり{fight.statusNote ? `：${fight.statusNote}` : ""}
          </p>
        </div>
      )}

      <div className={`flex items-center justify-between gap-3 ${large ? "text-base" : "text-sm"} ${isCancelled ? "line-through decoration-orange-600/60" : ""}`}>
        {/* 赤コーナー */}
        <div className="flex-1 text-left">
          <p className={`font-bold ${isCancelled ? "text-zinc-500" : "text-white"} ${large ? "text-lg" : ""}`}>
            {fight.redCorner.country && <span className="mr-1">{fight.redCorner.country}</span>}
            {fight.redCorner.name}
          </p>
        </div>

        {/* VS */}
        <div className="shrink-0 flex flex-col items-center">
          <span className="text-xs font-black text-zinc-500">VS</span>
        </div>

        {/* 青コーナー */}
        <div className="flex-1 text-right">
          <p className={`font-bold ${isCancelled ? "text-zinc-500" : "text-white"} ${large ? "text-lg" : ""}`}>
            {fight.blueCorner.name}
            {fight.blueCorner.country && <span className="ml-1">{fight.blueCorner.country}</span>}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2">
        <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">{fight.weightClass}</span>
        <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">{fight.rule}</span>
        {fight.rounds && (
          <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">{fight.rounds}</span>
        )}
      </div>
    </div>
  );
}
