import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import pic6 from "../assets/profile photos/pic-6.png";
import atlassianLogo from "../assets/logos/atlassian.png";
import yaleLogo from "../assets/logos/yale.png";
import googleLogo from "../assets/logos/google.png";
import editIcon from "../assets/icons/edit.svg";
import addPlusIcon from "../assets/icons/add-plus.svg";

const categoryListings = [
  {
    slug: "product-management",
    category: "Product Management",
    headline: "Experienced Product Leader at LinkedIn | Ex-Meta | Stanford GSB",
  },
  {
    slug: "mba",
    category: "MBA",
    headline: "MBA Coach | Stanford GSB | 100+ M7 Admits",
  },
  {
    slug: "college",
    category: "College",
    headline: "College Admissions Expert | Yale Grad | 50+ Ivy League Admits",
  },
];

export default function CoachManage() {
  useEffect(() => {
    document.title = "Leland Prototype | Manage";
  }, []);

  return (
    <div>
      <h1 className="text-[32px] font-medium text-gray-dark md:text-[40px]">Manage</h1>

      {/* Profile preview */}
      <div className="mt-8 rounded-2xl border border-[#E5E5E5] p-6">
        <div className="flex items-start gap-5">
          <img
            src={pic6}
            alt="Samantha Parker"
            className="h-[72px] w-[72px] shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0 flex-1">
            <h2 className="text-[24px] font-medium text-gray-dark">Samantha Parker</h2>
            <p className="mt-[2px] text-[18px] leading-[1.3] text-[#707070]">
              Experienced Product Leader at LinkedIn | Ex-Meta | Stanford GSB
            </p>
            <p className="mt-3 text-[16px] leading-[1.5] text-[#707070]">
              I help ambitious professionals break into top MBA programs and land PM roles at leading tech companies. With 8+ years in product at LinkedIn and Meta, plus my own Stanford GSB journey, I bring firsthand experience to every coaching session.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[16px] text-[#707070]">
              <div className="flex items-center gap-[6px]">
                <img src={atlassianLogo} alt="Atlassian" className="h-[18px] w-[18px] rounded" />
                <span>Atlassian</span>
              </div>
              <div className="flex items-center gap-[6px]">
                <img src={yaleLogo} alt="Yale University" className="h-[18px] w-[18px] rounded" />
                <span>Yale University</span>
              </div>
              <div className="flex items-center gap-[6px]">
                <img src={googleLogo} alt="Google" className="h-[18px] w-[18px] rounded" />
                <span>Google</span>
              </div>
            </div>
          </div>
          <Button size="sm" variant="secondary">
            <img src={editIcon} alt="" className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Category listings */}
      <h2 className="mt-10 text-[24px] font-medium text-gray-dark">Category Listings</h2>
      <div className="mt-4 overflow-hidden rounded-2xl border border-[#E5E5E5]">
        {categoryListings.map(({ slug, category, headline }, i) => (
          <div
            key={category}
            className={`flex items-center gap-3 px-5 py-4 transition-colors hover:bg-[#F5F5F5]${i > 0 ? " border-t border-[#E5E5E5]" : ""}`}
          >
            <div className="min-w-0 flex-1">
              <p className="text-[18px] font-medium leading-tight text-gray-dark">{category}</p>
              <p className="mt-[2px] truncate text-[16px] leading-tight text-[#707070]">{headline}</p>
            </div>
            <Link
              to={`/coach/manage/${slug}`}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-gray-hover px-3.5 py-2.5 text-[14px] font-medium leading-[1.2] text-gray-dark transition-colors hover:bg-[#ebebeb]"
            >
              <img src={editIcon} alt="" className="h-4 w-4" />
              Edit
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Button size="sm" variant="secondary">
          <img src={addPlusIcon} alt="" className="h-4 w-4" />
          Add new category
        </Button>
      </div>
    </div>
  );
}
