import { useEffect } from "react";

// Matches the "Sell on Leland" callout: #222222 dashed outline at 30% opacity.
const dashedBorderStyle = {
  backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%23222222' stroke-opacity='0.3' stroke-width='2' stroke-dasharray='3 4'/%3e%3c/svg%3e")`,
};

export default function MyLelandGoals() {
  useEffect(() => {
    document.title = "Leland Prototype | Goals";
  }, []);

  return (
    <div>
      <h1 className="font-serif text-[30px] font-medium leading-[1.1] text-gray-dark md:text-[38px]">Goals</h1>
      <p className="mt-2 text-[16px] text-gray-light">
        Track the goals you're working toward on Leland. Coming soon.
      </p>
      <div className="mt-8 flex flex-col gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-[160px] rounded-xl bg-[#222222]/[0.04]" style={dashedBorderStyle} />
        ))}
      </div>
    </div>
  );
}
