import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import homeIcon from "../assets/icons/nav-icons/home-inactive.svg";
import chatIcon from "../assets/icons/nav-icons/chat-inactive.svg";
import userIcon from "../assets/icons/user.svg";
import lightningIcon from "../assets/icons/lightning.svg";
import calendarIcon from "../assets/icons/calendar.svg";
import moneyIcon from "../assets/icons/money.svg";
import starIcon from "../assets/icons/star-icon.svg";
import discountIcon from "../assets/icons/discount.svg";
import storeIcon from "../assets/icons/store.svg";
import addPlusIcon from "../assets/icons/add-plus.svg";
import catProductManagement from "../assets/placeholder images/category images/product-management.png";
import catMba from "../assets/placeholder images/category images/management-consulting.png";
import catCollege from "../assets/placeholder images/category images/law-school.png";

const sidebarItems = [
  { to: "/coach/home", label: "Dashboard", icon: homeIcon, end: true },
  { to: "/coach/inbox", label: "Inbox", icon: chatIcon },
  { to: "/coach/manage", label: "Profile", icon: userIcon },
  { to: "/coach/profile-new", label: "Profile (new)", icon: userIcon },
  { to: "/coach/products", label: "Offerings", icon: storeIcon },
  { to: "/coach/opportunities", label: "Opportunities", icon: lightningIcon },
  { to: "/coach/calendar", label: "Calendar", icon: calendarIcon },
  { to: "/coach/earnings", label: "Earnings", icon: moneyIcon },
  { to: "/coach/reviews", label: "Reviews", icon: starIcon },
  { to: "/coach/discount-codes", label: "Discount Codes", icon: discountIcon },
];

const categories = [
  { to: "/coach/manage/product-management", label: "Product Management", image: catProductManagement },
  { to: "/coach/manage/mba", label: "MBA", image: catMba },
  { to: "/coach/manage/college", label: "College", image: catCollege },
];

export default function CoachLayout() {
  return (
    <div className="flex min-h-[calc(100vh-61px)]">
      {/* Sidebar — flush left, 8px padding, right border */}
      <aside className="hidden w-[220px] shrink-0 border-r border-gray-stroke p-2 md:block">
        <nav className="flex flex-col gap-1">
          {sidebarItems.map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex w-full items-center gap-3 rounded-lg px-3 py-3 text-[16px] font-medium transition-colors ${
                  isActive
                    ? "bg-[#222222]/5 text-gray-dark"
                    : "text-gray-dark hover:bg-gray-hover"
                }`
              }
            >
              <img src={icon} alt="" className="h-6 w-6 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Categories section */}
        <div className="mt-2 border-t border-gray-stroke pt-3">
          <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#999999]">
            Categories
          </p>
          <nav className="flex flex-col gap-1">
            {categories.map(({ to, label, image }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex w-full items-center gap-3 rounded-lg px-3 py-3 text-[16px] font-medium transition-colors ${
                    isActive
                      ? "bg-[#222222]/5 text-gray-dark"
                      : "text-gray-dark hover:bg-gray-hover"
                  }`
                }
              >
                <img
                  src={image}
                  alt=""
                  className="h-6 w-6 shrink-0 rounded-md object-cover"
                />
                <span className="truncate">{label}</span>
              </NavLink>
            ))}
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-[16px] font-medium text-[#999999] transition-colors hover:bg-gray-hover hover:text-[#707070]">
              <img src={addPlusIcon} alt="" className="h-6 w-6 shrink-0 opacity-40" />
              Add category
            </button>
          </nav>
        </div>
      </aside>

      {/* Main content — fills remaining space, capped at 1280px */}
      <div className="min-w-0 flex-1">
        <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 sm:py-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
