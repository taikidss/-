import Link from "next/link";
import Image from "next/image";
import { venues } from "./data/venues";
import { readPhotos } from "./lib/photos";

export default function Home() {
  const photos = readPhotos();

  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <span className="font-bold tracking-tight text-white">ビューン</span>
        <Link
          href="/upload"
          className="rounded-full bg-red-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-500 transition-colors"
        >
          + 写真を投稿
        </Link>
      </header>

      {/* ヒーロー */}
      <section className="px-5 pt-12 pb-10 sm:pt-16 sm:pb-12 text-center">
        <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
          あなたの席、実際どう見える？
        </h1>
        <p className="mt-4 text-lg text-zinc-400 max-w-md mx-auto">
          格闘技会場の座席からの眺めを、チケットを買う前に確認できるアプリ
        </p>
        <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/upload"
            className="rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white hover:bg-red-500 transition-colors"
          >
            写真を投稿する
          </Link>
          <Link
            href="/ranking"
            className="rounded-full border border-yellow-600/50 bg-yellow-500/10 px-6 py-3 text-sm font-bold text-yellow-400 hover:bg-yellow-500/20 transition-colors"
          >
            🏆 座席ランキング
          </Link>
          <a
            href="#venues"
            className="rounded-full border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 hover:border-zinc-500 transition-colors"
          >
            会場を見る
          </a>
        </div>
      </section>

      {/* 統計バー */}
      <section className="border-y border-zinc-800 py-5">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-center gap-10 text-center">
          <div>
            <p className="text-2xl font-black text-white">{photos.length}</p>
            <p className="text-xs text-zinc-500 mt-0.5">投稿写真</p>
          </div>
          <div className="w-px h-8 bg-zinc-800" />
          <div>
            <p className="text-2xl font-black text-white">{venues.length}</p>
            <p className="text-xs text-zinc-500 mt-0.5">対応会場</p>
          </div>
          <div className="w-px h-8 bg-zinc-800" />
          <div>
            <p className="text-2xl font-black text-white">
              {venues.reduce((s, v) => s + v.sections.length, 0)}
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">ブロック数</p>
          </div>
        </div>
      </section>

      {/* 会場一覧 */}
      <section id="venues" className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-xl font-bold text-white mb-6">会場を選ぶ</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => {
            const count = photos.filter((p) => p.venueId === venue.id).length;
            return (
              <Link
                key={venue.id}
                href={`/venue/${venue.id}`}
                className="group relative rounded-2xl overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/60"
              >
                {/* 会場写真 */}
                <div className="relative h-44 overflow-hidden bg-zinc-900">
                  <Image
                    src={venue.coverImage}
                    alt={venue.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* 上部グラデーション（ライセンス表示のため薄く） */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* 写真数バッジ */}
                  <span className="absolute top-3 right-3 rounded-full bg-black/60 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-white">
                    {count}件
                  </span>
                </div>

                {/* テキスト情報 */}
                <div className="bg-zinc-900 p-4">
                  <h3 className="font-bold text-white text-sm leading-snug group-hover:text-red-400 transition-colors">
                    {venue.name}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {venue.sections.map((section) => (
                      <span
                        key={section.id}
                        className="rounded-full px-2 py-0.5 text-xs"
                        style={{
                          background: section.color + "18",
                          color: section.color,
                          border: `1px solid ${section.color}35`,
                        }}
                      >
                        {section.name}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* フッター CTA */}
      <section className="border-t border-zinc-800 py-14 text-center px-6">
        <p className="text-zinc-400 text-sm mb-4">
          あなたの会場写真を共有して、みんなの役に立てよう
        </p>
        <Link
          href="/upload"
          className="inline-block rounded-full bg-zinc-100 px-6 py-3 text-sm font-bold text-zinc-900 hover:bg-white transition-colors"
        >
          座席写真をアップロードする
        </Link>
      </section>
    </div>
  );
}
