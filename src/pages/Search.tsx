import { useEffect } from "react";

import { Search as SearchIcon } from "lucide-react";

export default function Search() {
  useEffect(() => { document.title = "Leland Prototype | Search"; }, []);
  return (
    <div>
      {/* Search input */}
      <div className="relative">
        <SearchIcon
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-xlight"
        />
        <input
          type="text"
          autoFocus
          placeholder="Search for anything..."
          className="w-full rounded-full border border-gray-stroke bg-gray-hover py-3 pl-12 pr-4 text-sm outline-none placeholder:font-normal placeholder:text-gray-xlight"
        />
      </div>
    </div>
  );
}
