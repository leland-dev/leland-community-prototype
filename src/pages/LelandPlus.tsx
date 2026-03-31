export default function LelandPlus() {
  return (
    <div>
      <h1 className="text-[32px] font-medium text-gray-dark md:text-[40px]">Leland+</h1>
      <p className="mt-1 text-[18px] text-gray-light">
        Exclusive perks and content for Leland+ members.
      </p>

      <div className="mt-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-stroke p-5"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-gray-stroke" />
              <div className="h-4 w-32 animate-pulse rounded bg-gray-stroke" />
            </div>
            <div className="mt-3 space-y-2">
              <div className="h-3.5 w-full animate-pulse rounded bg-gray-hover" />
              <div className="h-3.5 w-4/5 animate-pulse rounded bg-gray-hover" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
