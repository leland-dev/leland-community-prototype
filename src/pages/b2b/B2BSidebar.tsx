import { navItems, type B2BView } from "./B2BData";
import kelloggLogo from "../../assets/img/kellogg.svg";

export default function B2BSidebar({
  activeView,
  onNavigate,
  items = navItems,
}: {
  activeView: B2BView;
  onNavigate: (view: B2BView) => void;
  items?: typeof navItems;
}) {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-gray-stroke bg-white">
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-2">
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[18px] font-medium text-gray-dark transition-all ${
              activeView === item.key
                ? "bg-[#222222]/5"
                : "hover:bg-gray-hover"
            }`}
          >
            <img src={item.icon} alt="" className="h-6 w-6 shrink-0" />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="mx-4 flex flex-col items-center pb-6">
        <div className="flex w-full items-center gap-[6px]">
          <div className="h-px flex-1 bg-gray-stroke" />
          <span className="whitespace-nowrap text-[14px] font-normal uppercase tracking-[0.1em] text-[#9B9B9B]">Provisioned for</span>
          <div className="h-px flex-1 bg-gray-stroke" />
        </div>
        <img src={kelloggLogo} alt="Kellogg School of Management" className="mt-5 max-h-16 max-w-[60%]" />
      </div>
    </aside>
  );
}
