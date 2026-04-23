export default function Loading() {
  return (
    <div className="min-h-screen animate-pulse">
      <div className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="h-5 w-16 bg-zinc-800 rounded" />
        <div className="h-8 w-20 bg-zinc-800 rounded-full" />
      </div>
      <main className="max-w-2xl mx-auto px-5 py-8">
        <div className="h-4 w-56 bg-zinc-800 rounded mb-6" />
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden mb-6">
          <div className="w-full aspect-video bg-zinc-800" />
          <div className="p-5 flex flex-col gap-3">
            <div className="h-4 w-24 bg-zinc-800 rounded" />
            <div className="h-7 w-64 bg-zinc-800 rounded" />
            <div className="h-4 w-48 bg-zinc-700 rounded" />
            <div className="h-12 bg-zinc-800 rounded-xl mt-2" />
          </div>
        </div>
        <div className="h-5 w-24 bg-zinc-800 rounded mb-3" />
        <div className="flex flex-col gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-zinc-800 bg-zinc-950 h-32" />
          ))}
        </div>
      </main>
    </div>
  );
}
