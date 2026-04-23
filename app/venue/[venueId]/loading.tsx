export default function Loading() {
  return (
    <div className="min-h-screen animate-pulse">
      <div className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="h-5 w-16 bg-zinc-800 rounded" />
        <div className="h-8 w-24 bg-zinc-800 rounded-full" />
      </div>
      <div className="max-w-6xl mx-auto px-5 py-8">
        <div className="h-4 w-48 bg-zinc-800 rounded mb-6" />
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
          <div className="lg:w-[400px] shrink-0">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 h-80" />
          </div>
          <div className="flex-1 grid gap-3 grid-cols-2 sm:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900 aspect-video" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
