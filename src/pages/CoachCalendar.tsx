import { useEffect } from "react";

const dashedBorderStyle = {
  backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%23C5C5C5' stroke-width='2' stroke-dasharray='4%2c 4' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")`,
};

export default function CoachCalendar() {
  useEffect(() => {
    document.title = "Leland Prototype | Calendar";
  }, []);

  return (
    <div>
      <h1 className="text-[32px] font-medium text-gray-dark md:text-[40px]">Calendar</h1>
      <div className="mt-8 flex flex-col gap-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-[160px] rounded-xl bg-[#F5F5F5]" style={dashedBorderStyle} />
        ))}
      </div>
    </div>
  );
}
