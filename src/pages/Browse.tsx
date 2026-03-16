import {
  Users,
  Calendar,
  Rocket,
  BookOpen,
  Sparkles,
  GraduationCap,
} from "lucide-react";

const categories = [
  { name: "Coaching", icon: Users, color: "bg-blue/10 text-blue" },
  { name: "Events", icon: Calendar, color: "bg-orange/10 text-orange" },
  { name: "Bootcamps", icon: Rocket, color: "bg-red/10 text-red" },
  { name: "Courses", icon: BookOpen, color: "bg-blue/10 text-blue" },
  { name: "Leland+", icon: Sparkles, color: "bg-primary-xlight text-primary" },
  {
    name: "Graduate Programs",
    icon: GraduationCap,
    color: "bg-yellow/10 text-yellow",
  },
];

export default function Browse() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-dark">Browse</h1>
      <p className="mt-1 text-sm text-gray-light">
        Explore categories across Leland&rsquo;s offerings.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {categories.map(({ name, icon: Icon, color }) => (
          <button
            key={name}
            className="flex flex-col items-center gap-3 rounded-lg border border-gray-stroke p-5 transition-colors hover:border-gray-xlight hover:bg-gray-hover"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-lg ${color}`}
            >
              <Icon size={24} />
            </div>
            <span className="text-sm font-medium text-gray-dark">{name}</span>
          </button>
        ))}
      </div>

      {/* Trending section skeleton */}
      <h2 className="mt-10 text-lg font-semibold text-gray-dark">
        Trending Now
      </h2>
      <div className="mt-3 space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-lg border border-gray-stroke p-4 shadow-card"
          >
            <div className="h-14 w-14 shrink-0 animate-pulse rounded-lg bg-gray-stroke" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-3.5 w-3/4 animate-pulse rounded bg-gray-stroke" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-gray-hover" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
