import { useEffect } from "react";

import { Search as SearchIcon } from "lucide-react";

export default function Search() {
  useEffect(() => { document.title = "Leland Prototype | Search"; }, []);
  return (
    <div>
      <h1 className="font-serif text-[36px] font-medium text-gray-dark">Search</h1>
      <p className="mt-2 text-[16px] text-gray-light">
        Find experts, programs, livestreams, and more.
      </p>

      {/* Search input */}
      <div className="relative mt-8">
        <SearchIcon
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-xlight"
        />
        <input
          type="text"
          autoFocus
          placeholder="Search for anything..."
          className="w-full rounded-lg border border-gray-stroke bg-gray-hover py-3 pl-12 pr-4 text-sm outline-none transition-colors placeholder:text-gray-xlight focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </div>
  );
}
