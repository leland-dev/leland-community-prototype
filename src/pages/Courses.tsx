export default function Courses() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-dark">Courses</h1>
      <p className="mt-1 text-sm text-gray-light">
        Self-paced courses to level up your career.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-stroke p-4"
          >
            <div className="h-32 w-full animate-pulse rounded bg-gray-stroke" />
            <div className="mt-3 space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-stroke" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-gray-hover" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
