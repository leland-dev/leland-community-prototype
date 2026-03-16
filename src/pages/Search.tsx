import { Search as SearchIcon } from "lucide-react";

export default function Search() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-dark">Search</h1>
      <p className="mt-1 text-sm text-gray-light">
        Find coaches, programs, events, and more.
      </p>

      {/* Search input */}
      <div className="relative mt-6">
        <SearchIcon
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-xlight"
        />
        <input
          type="text"
          placeholder="Search Leland..."
          className="w-full rounded-lg border border-gray-stroke bg-gray-hover py-3 pl-12 pr-4 text-sm outline-none transition-colors placeholder:text-gray-xlight focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Empty state */}
      <div className="mt-16 flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-hover">
          <SearchIcon size={28} className="text-gray-xlight" />
        </div>
        <p className="mt-4 text-sm font-medium text-gray-dark">
          Search for anything on Leland
        </p>
        <p className="mt-1 text-xs text-gray-xlight">
          Try &ldquo;MBA admissions coach&rdquo; or &ldquo;product management
          bootcamp&rdquo;
        </p>
      </div>

      {/* Recent searches skeleton */}
      <div className="mt-12">
        <h2 className="text-sm font-semibold text-gray-light uppercase tracking-wide">
          Recent Searches
        </h2>
        <div className="mt-3 space-y-2">
          {["MBA coaching", "Interview prep", "Resume review"].map((term) => (
            <div
              key={term}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-dark hover:bg-gray-hover cursor-pointer"
            >
              <SearchIcon size={16} className="text-gray-xlight" />
              {term}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
