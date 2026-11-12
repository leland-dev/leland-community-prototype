import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "../components/Button";
import OfferingSections from "../components/OfferingSections";
import { getProfilePerson } from "../lib/profilePeople";
import { loadSections } from "../lib/storefrontSections";
import chevronLeftIcon from "../assets/icons/chevron-right.svg";

// Full "all offerings" page linked from a coach's Offerings tab. A pill toggle
// group across the top swaps between the expert's storefront sections (All + one
// per section); the active pill is kept in the URL (?section=…) so "See all →"
// deep-links straight to that filter.

export default function ProfileOfferingsPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const person = getProfilePerson(slug);
  const name = person?.name ?? "This expert";
  const firstName = name.split(" ")[0];

  const filters = [
    { id: "all", label: "All" },
    ...loadSections().map((s) => ({ id: s.id, label: s.title })),
  ];

  const raw = searchParams.get("section");
  const active = filters.some((f) => f.id === raw) ? (raw as string) : "all";

  useEffect(() => {
    document.title = `Leland Prototype | ${firstName}'s offerings`;
  }, [firstName]);

  const setActive = (id: string) => {
    setSearchParams(id === "all" ? {} : { section: id }, { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header — back + expert identity. */}
      <header className="sticky top-0 z-20 border-b border-gray-stroke bg-white/90 backdrop-blur-[12px]">
        <div className="mx-auto flex w-full max-w-[1040px] items-center gap-3 px-4 py-3 sm:px-6">
          <Button size="sm" variant="secondary" iconOnly onClick={() => navigate(-1)} aria-label="Back">
            <img src={chevronLeftIcon} alt="" className="h-[18px] w-[18px] rotate-180" />
          </Button>
          <div className="flex min-w-0 items-center gap-2.5">
            {person?.avatar && <img src={person.avatar} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" />}
            <div className="min-w-0 leading-tight">
              <p className="truncate text-[15px] font-semibold text-gray-dark">{name}</p>
              <p className="text-[12px] text-gray-light">Offerings</p>
            </div>
          </div>
        </div>
        {/* Toggle group. */}
        <div className="mx-auto w-full max-w-[1040px] px-4 pb-3 sm:px-6">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => {
              const isActive = active === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActive(f.id)}
                  className={`cursor-pointer rounded-full px-[14px] py-[7px] text-[13px] font-semibold transition-colors ${
                    isActive
                      ? "bg-gray-dark text-white"
                      : "bg-[#f5f5f5] text-gray-dark hover:bg-[#ebebeb]"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1040px] px-4 py-8 sm:px-6">
        <h1 className="mb-8 text-[26px] font-semibold text-gray-dark sm:text-[30px]">
          Work with {firstName}
        </h1>
        <OfferingSections slug={slug} variant="full" activeSection={active} />
      </main>
    </div>
  );
}
