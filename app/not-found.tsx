import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="text-6xl mb-4">🥊</p>
      <h1 className="text-2xl font-black text-white mb-2">404 — このページはありません</h1>
      <p className="text-zinc-500 text-sm mb-8">
        URLが間違っているか、削除された可能性があります
      </p>
      <Link
        href="/"
        className="rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white hover:bg-red-500 transition-colors"
      >
        トップに戻る
      </Link>
    </div>
  );
}
