export default function Notifications() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-dark">Notifications</h1>
      <p className="mt-1 text-sm text-gray-light">
        Stay updated on activity that matters to you.
      </p>

      {/* Filter tabs */}
      <div className="mt-6 flex gap-1 border-b border-gray-stroke">
        {["All", "Mentions", "Replies"].map((tab, i) => (
          <button
            key={tab}
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${
              i === 0
                ? "text-gray-dark shadow-[inset_0_-2px_0_0_#15b078]"
                : "text-gray-light hover:text-gray-dark"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notification items skeleton */}
      <div className="mt-2 divide-y divide-gray-hover">
        {[
          { unread: true },
          { unread: true },
          { unread: false },
          { unread: false },
          { unread: false },
        ].map((item, i) => (
          <div
            key={i}
            className={`flex gap-3 px-2 py-4 ${
              item.unread ? "bg-primary-xlight" : ""
            }`}
          >
            <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-gray-stroke" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="h-3.5 w-4/5 animate-pulse rounded bg-gray-stroke" />
              <div className="h-3 w-3/5 animate-pulse rounded bg-gray-hover" />
              <div className="h-3 w-24 animate-pulse rounded bg-gray-hover" />
            </div>
            {item.unread && (
              <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
