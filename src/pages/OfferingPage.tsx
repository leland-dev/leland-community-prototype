import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "../components/Button";
import { getOfferingBySlug, type Offering } from "../lib/offerings";
import labelTagIcon from "../assets/icons/label-tag.svg";
import samanthaPhoto from "../assets/profile photos/pic-6.png";
import reviewPhoto1 from "../assets/profile photos/pic-1.png";
import reviewPhoto2 from "../assets/profile photos/pic-2.png";

// Customer-facing offering page — the published counterpart of the coach's
// "Page" setup tab. Two-column layout: content sections on the left, a sticky
// purchase card on the right. Linked from each offering card on the profile.

// Sample page content. Offerings don't carry real page-section data yet, so we
// synthesize a plausible set of sections keyed off the offering itself.
const CHECKLIST_ITEMS = [
  "One-on-one time directly with Samantha",
  "Personalized feedback tailored to your goals",
  "A clear, actionable plan after every session",
  "Access to Samantha's templates and resources",
];

const REVIEWS = [
  { name: "Jordan Reyes", photo: reviewPhoto1, role: "MBA Admissions", rating: 5, text: "Samantha completely reshaped my application strategy. She helped me restructure my essays and think about my story in a way I never would have on my own. I got into my top-choice program." },
  { name: "Priya Natarajan", photo: reviewPhoto2, role: "Interview Prep", rating: 5, text: "The mock interviews were incredibly realistic. She gave sharp, specific feedback each round, and I walked into every real interview feeling calm and prepared." },
];

const FAQS = [
  { q: "How does scheduling work?", a: "After you purchase, you'll get a link to book your sessions at times that work for you. Samantha keeps a flexible calendar and will do her best to accommodate your timeline." },
  { q: "What happens right after I purchase?", a: "You'll receive a confirmation email with next steps, an intake form so Samantha can prepare, and access to any included resources." },
  { q: "Is this a good fit if I'm just getting started?", a: "Absolutely. Samantha tailors every engagement to where you are — whether you're just exploring or deep into your applications." },
];

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="h-4 w-4" viewBox="0 0 24 24" fill={i < rating ? "#F3C948" : "none"} stroke={i < rating ? "#F3C948" : "#D0D0D0"} strokeWidth="1.5" strokeLinejoin="round">
          <path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.3l-5.8 3.06 1.1-6.46-4.7-4.58 6.5-.94L12 2.5z" />
        </svg>
      ))}
    </div>
  );
}

function PriceRow({ offering, className = "" }: { offering: Offering; className?: string }) {
  return (
    <div className={className}>
      {offering.startingAt && (
        <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.05em] text-gray-extra-light">Starting at</p>
      )}
      <p className="flex items-baseline gap-x-1 text-[15px] font-semibold text-gray-dark">
        <span>{offering.price}</span>
        {offering.origPrice && <span className="font-normal text-gray-extra-light line-through">{offering.origPrice}</span>}
        {offering.savePct != null && <span className="ml-auto text-[12px] font-medium text-[#1B8A54]">Save {offering.savePct}%</span>}
      </p>
    </div>
  );
}

// The sticky purchase card on the right — the customer-facing counterpart of the
// coach builder's live preview card.
function PurchaseCard({ offering }: { offering: Offering }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-stroke bg-white shadow-[0_1px_3px_rgba(16,24,40,0.06)]">
      <img src={offering.image} alt="" className="aspect-[1200/630] w-full object-cover" />
      <div className="p-4">
        <p className="text-[16px] font-semibold leading-tight text-gray-dark">{offering.title}</p>
        <p className="mt-1 text-[14px] leading-snug text-gray-light">{offering.headline}</p>
        <PriceRow offering={offering} className="mt-3" />
        <Button size="lg" variant="primary" rounded="rounded-full" className="mt-4 w-full text-[15px] font-semibold">
          Purchase
        </Button>
      </div>
    </div>
  );
}

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="mt-10 border-t border-gray-stroke pt-8">
      <h2 className="mb-4 text-[20px] font-semibold text-gray-dark">{heading}</h2>
      {children}
    </section>
  );
}

export default function OfferingPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const offering = getOfferingBySlug(slug);

  useEffect(() => {
    document.title = offering ? `Leland | ${offering.title}` : "Leland | Offering";
    window.scrollTo(0, 0);
  }, [offering]);

  if (!offering) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-4 text-center">
        <p className="text-[18px] font-semibold text-gray-dark">Offering not found</p>
        <Link to="/profile/samantha-parker" className="text-[15px] font-medium text-gray-light underline">Back to profile</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-stroke bg-white px-4 py-3 md:px-8">
        <button
          onClick={() => navigate(-1)}
          aria-label="Close"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#f5f5f5] text-gray-dark transition-colors hover:bg-[#ebebeb]"
        >
          <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <div className="flex items-center gap-2 text-[15px] font-medium text-gray-dark">
          <img src={samanthaPhoto} alt="" className="h-6 w-6 rounded-full object-cover" />
          By Samantha Parker
        </div>
      </header>

      <div className="mx-auto max-w-[1080px] px-4 py-8 md:px-8 md:py-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-14">
          {/* Left: content */}
          <main className="min-w-0 flex-1">
            <h1 className="font-serif text-[36px] leading-tight text-gray-dark md:text-[44px]">{offering.title}</h1>
            <p className="mt-2 text-[18px] leading-tight text-gray-extra-light">{offering.headline}</p>

            {/* Price + author bar */}
            <div className="mt-5 flex items-center rounded-xl border border-gray-stroke">
              <div className="flex flex-1 items-center justify-center gap-2 py-3 text-[15px] font-medium text-gray-dark">
                <img src={labelTagIcon} alt="" className="h-4 w-4" />
                {offering.startingAt ? "Starting at " : ""}{offering.price}
              </div>
              <div className="h-6 w-px bg-gray-stroke" />
              <div className="flex flex-1 items-center justify-center gap-2 py-3 text-[15px] font-medium text-gray-dark">
                <img src={samanthaPhoto} alt="" className="h-5 w-5 rounded-full object-cover" />
                By Samantha Parker
              </div>
            </div>

            {offering.description && (
              <p className="mt-6 text-[16px] leading-relaxed text-gray-dark">{offering.description}</p>
            )}

            {/* Checklist */}
            <Section heading="What's included">
              <ul className="flex flex-col gap-3">
                {CHECKLIST_ITEMS.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg className="mt-0.5 h-5 w-5 shrink-0 text-[#1B8A54]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M8 12l2.5 2.5L16 9" />
                    </svg>
                    <span className="text-[16px] leading-snug text-gray-dark">{item}</span>
                  </li>
                ))}
              </ul>
            </Section>

            {/* Reviews */}
            <Section heading="What clients are saying">
              <div className="flex flex-col gap-4">
                {REVIEWS.map((r) => (
                  <div key={r.name} className="rounded-2xl border border-gray-stroke p-5">
                    <div className="flex items-center gap-3">
                      <img src={r.photo} alt="" className="h-10 w-10 rounded-full object-cover" />
                      <div className="min-w-0">
                        <p className="text-[15px] font-semibold text-gray-dark">{r.name}</p>
                        <p className="text-[13px] text-gray-light">{r.role}</p>
                      </div>
                      <div className="ml-auto">
                        <StarRow rating={r.rating} />
                      </div>
                    </div>
                    <p className="mt-3 text-[15px] leading-relaxed text-gray-dark">{r.text}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* FAQs */}
            <Section heading="Frequently asked questions">
              <div className="flex flex-col divide-y divide-gray-stroke">
                {FAQS.map((f) => (
                  <div key={f.q} className="py-4 first:pt-0">
                    <p className="text-[16px] font-semibold text-gray-dark">{f.q}</p>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-gray-light">{f.a}</p>
                  </div>
                ))}
              </div>
            </Section>
          </main>

          {/* Right: sticky purchase card */}
          <aside className="w-full lg:sticky lg:top-[88px] lg:h-fit lg:w-[340px] lg:shrink-0">
            <PurchaseCard offering={offering} />
          </aside>
        </div>
      </div>
    </div>
  );
}
