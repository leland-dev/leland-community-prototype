import { useEffect } from "react";

export default function CoachPricing() {
  useEffect(() => {
    document.title = "Leland Prototype | Pricing";
  }, []);

  return (
    <div className="pb-8">
      <h1 className="font-serif text-[42px] leading-[1.05] text-gray-dark md:text-[48px]">Pricing</h1>
      <p className="mt-2 text-[18px] font-normal text-gray-light">
        Set your default rates and packages across your storefront.
      </p>
    </div>
  );
}
