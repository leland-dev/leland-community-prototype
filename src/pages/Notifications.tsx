import { Link } from "react-router-dom";
import settingsIcon from "../assets/icons/settings.svg";

export default function Notifications() {
  const dashedBorderStyle = {
    backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%23C5C5C5' stroke-width='2' stroke-dasharray='4%2c 4' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")`,
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-[40px] font-medium text-gray-dark">
          Notifications
        </h1>
        <Link
          to="/settings?tab=notifications"
          className="flex items-center justify-center rounded-full bg-[#222222]/5 p-2.5 transition-colors hover:bg-[#222222]/[0.08]"
        >
          <img src={settingsIcon} alt="Settings" className="h-5 w-5" />
        </Link>
      </div>

      {/* Placeholder boxes */}
      <div className="mt-8 flex flex-col gap-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-[160px] rounded-xl bg-[#F5F5F5]"
            style={dashedBorderStyle}
          />
        ))}
      </div>
    </div>
  );
}
