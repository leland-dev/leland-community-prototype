export default function Messaging() {
  return (
    <div>
      <h1 className="text-[32px] font-medium text-gray-dark md:text-[40px]">Messages</h1>
      <p className="mt-1 text-[18px] text-gray-light">
        Your conversations with coaches and peers.
      </p>

      {/* Search conversations */}
      <div className="mt-6">
        <input
          type="text"
          placeholder="Search messages..."
          className="w-full rounded-lg border border-gray-stroke bg-gray-hover px-4 py-2.5 text-sm outline-none placeholder:text-gray-xlight focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Conversation list skeleton */}
      <div className="mt-4 divide-y divide-gray-hover">
        {[
          { unread: true, time: "2m" },
          { unread: true, time: "1h" },
          { unread: false, time: "3h" },
          { unread: false, time: "1d" },
          { unread: false, time: "3d" },
        ].map((conv, i) => (
          <div
            key={i}
            className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-gray-hover"
          >
            <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-gray-stroke" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <div
                  className={`h-3.5 w-28 animate-pulse rounded ${
                    conv.unread ? "bg-gray-xlight" : "bg-gray-stroke"
                  }`}
                />
                <span className="text-xs text-gray-xlight">{conv.time}</span>
              </div>
              <div className="mt-1.5 h-3 w-4/5 animate-pulse rounded bg-gray-hover" />
            </div>
            {conv.unread && (
              <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
