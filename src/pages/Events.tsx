export default function Events() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-dark">Free Events</h1>
      <p className="mt-1 text-sm text-gray-light">
        Live sessions, workshops, and Q&amp;As from top coaches.
      </p>

      <div className="mt-6 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-lg border border-gray-stroke p-4"
          >
            <div className="flex h-14 w-14 shrink-0 animate-pulse flex-col items-center justify-center rounded-lg bg-gray-stroke" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-3.5 w-3/4 animate-pulse rounded bg-gray-stroke" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-gray-hover" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-gray-hover" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
