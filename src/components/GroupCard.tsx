import { Link } from "react-router-dom";
import chevronRightIcon from "../assets/icons/chevron-right.svg";

export interface GroupCardProps {
  name: string;
  color?: string;
  image?: string;
  members: number;
  newPosts: number;
  to: string;
  size?: "large" | "small";
}

export default function GroupCard({
  name,
  color,
  image,
  members,
  newPosts,
  to,
  size = "large",
}: GroupCardProps) {
  const isSmall = size === "small";
  const titleSizeClass = isSmall ? "text-[14px]" : "text-[16px]";
  const subtitleSizeClass = isSmall ? "text-[12px]" : "text-[14px]";
  const imageSize = isSmall ? "h-[36px] w-[36px]" : "h-[40px] w-[40px]";

  return (
    <Link
      to={to}
      className={`group flex items-center gap-3 rounded-[12px] bg-white pl-2 pr-3 transition-colors hover:bg-[#F5F5F5] ${isSmall ? "py-[10px]" : "py-3"}`}
    >
      {/* Square avatar */}
      <div className="relative shrink-0">
        {image ? (
          <img
            src={image}
            alt=""
            className={`${imageSize} rounded-[4px] object-cover`}
          />
        ) : (
          <div
            className={`${imageSize} rounded-[4px] flex items-center justify-center text-white text-[14px] font-bold`}
            style={{ backgroundColor: color }}
          >
            {name.charAt(0)}
          </div>
        )}
        {newPosts > 0 && (
          <div
            className="absolute h-[6px] w-[6px] rounded-full bg-[#E2574C]"
            style={{ bottom: -2, right: -2, boxShadow: "0 0 0 2px white" }}
          />
        )}
      </div>

      {/* Name + meta */}
      <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
        <p className={`truncate ${titleSizeClass} leading-tight font-medium text-gray-dark`}>
          {name}
        </p>
        <p className={`truncate ${subtitleSizeClass} leading-tight text-[#707070]`}>
          {members} members{newPosts > 0 && <> <span className="text-[#9B9B9B]">&middot;</span> {newPosts} new post{newPosts !== 1 ? "s" : ""}</>}
        </p>
      </div>

      {/* Chevron */}
      <img
        src={chevronRightIcon}
        alt=""
        className="h-[20px] w-[20px] shrink-0 opacity-40 transition-opacity group-hover:opacity-70"
      />
    </Link>
  );
}
