import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import giftIcon from "../assets/icons/gift.svg";
import usersGroupIcon from "../assets/icons/users-group.svg";
import documentIcon from "../assets/icons/document.svg";
import gridIcon from "../assets/icons/layout-grid.svg";
import gradIcon from "../assets/icons/graduate-hat.svg";

// Step 1 of the create-product flow: pick a product type.
const productTypes = [
  { slug: "package", label: "Package", description: "Bundle multiple sessions or services into one offering.", icon: giftIcon },
  { slug: "membership", label: "Membership", description: "Charge a recurring subscription for ongoing access.", icon: usersGroupIcon },
  { slug: "content", label: "Content", description: "Sell guides, templates, videos, or downloadable resources.", icon: documentIcon },
  { slug: "collection", label: "Collection", description: "Group related products together into one bundle.", icon: gridIcon },
  { slug: "course", label: "Course", description: "Create and sell a structured, multi-lesson course.", icon: gradIcon },
];

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <Button size="sm" variant="secondary" iconOnly onClick={onClick} aria-label="Go back">
      <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </Button>
  );
}

export default function CoachProductNew() {
  const { category, type } = useParams<{ category: string; type?: string }>();
  const navigate = useNavigate();
  const selected = productTypes.find((t) => t.slug === type);

  useEffect(() => {
    document.title = "Leland Prototype | New product";
  }, []);

  // Step 2 placeholder — reached after choosing a type.
  if (type) {
    return (
      <div className="max-w-[720px]">
        <div className="mb-6">
          <BackButton onClick={() => navigate(`/coach/manage/${category}/new-product`)} />
        </div>
        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#999999]">
          New {selected?.label ?? "product"}
        </p>
        <h1 className="mt-2 font-serif text-[28px] leading-[1.2] text-gray-dark md:text-[32px]">
          Set up your {selected?.label.toLowerCase() ?? "product"}
        </h1>
        <p className="mt-3 text-[16px] leading-[1.5] text-[#707070]">This step is coming next.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[720px]">
      <div className="mb-6">
        <BackButton onClick={() => navigate(`/coach/manage/${category}`)} />
      </div>
      <h1 className="font-serif text-[28px] leading-[1.2] text-gray-dark md:text-[32px]">Choose a product type</h1>
      <p className="mt-2 text-[16px] leading-[1.5] text-[#707070]">
        Pick the format that best fits what you're offering.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {productTypes.map((t) => (
          <button
            key={t.slug}
            onClick={() => navigate(`/coach/manage/${category}/new-product/${t.slug}`)}
            className="group flex items-start gap-4 rounded-2xl border border-gray-stroke bg-white p-4 text-left transition-all hover:border-[#222222]/25 hover:shadow-[0_1px_3px_rgba(16,24,40,0.08)]"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-[#f5f5f5] icon-tile">
              <img src={t.icon} alt="" className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="text-[16px] font-semibold leading-tight text-gray-dark">{t.label}</p>
              <p className="mt-1 text-[14px] leading-snug text-[#707070]">{t.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
