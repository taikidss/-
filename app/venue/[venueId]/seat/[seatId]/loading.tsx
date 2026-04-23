export default function Loading() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-10 w-full animate-pulse">
      <div className="h-4 w-64 bg-zinc-800 rounded mb-6" />
      <div className="rounded-xl bg-zinc-800 h-[260px] sm:h-[420px] lg:h-[500px]" />
      <div className="mt-5 flex flex-wrap gap-4 items-start justify-between">
        <div className="flex flex-col gap-2">
          <div className="h-7 w-48 bg-zinc-800 rounded" />
          <div className="h-4 w-72 bg-zinc-700 rounded" />
          <div className="h-5 w-32 bg-zinc-800 rounded mt-1" />
        </div>
        <div className="h-8 w-24 bg-zinc-800 rounded-full" />
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-10 w-36 bg-zinc-800 rounded-full" />
        <div className="h-10 w-40 bg-zinc-800 rounded-full" />
      </div>
    </main>
  );
}
