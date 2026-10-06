import { useEffect } from "react";

// Placeholder destination for the v4 top-nav "Livestreams" item. Content TBD —
// this just gives the nav item a real page to land on.
const dashedBorderStyle = {
  backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%23C5C5C5' stroke-width='2' stroke-dasharray='4%2c 4' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")`,
};

export default function AltNavLivestreams() {
  useEffect(() => {
    document.title = "Leland Prototype | Livestreams";
  }, []);

  return (
    <div>
      <h1 className="font-serif text-[30px] font-medium leading-[1.1] text-gray-dark md:text-[38px]">Livestreams</h1>
      <p className="mt-2 text-[16px] text-gray-light">Live sessions and replays will show up here.</p>
      <div className="mt-8 flex flex-col gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-[160px] rounded-xl bg-[#F5F5F5]" style={dashedBorderStyle} />
        ))}
      </div>
    </div>
  );
}
