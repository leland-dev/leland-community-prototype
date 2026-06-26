import { LinkButton } from "../../../../../components/Button";

type Props = {
  programUrn: string;
};

// AIBP intentionally hides the 1:1 upsell per project doc — coach bandwidth.
// Returns null for AIBP. Other programs render a stub card.
export default function OneOnOneUpsell({ programUrn }: Props) {
  if (programUrn.startsWith("aibp")) return null;
  return (
    <section className="rounded-2xl border border-gray-stroke bg-white p-5">
      <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-light">
        Want personal feedback?
      </div>
      <h3 className="mt-2 text-[16px] font-medium leading-tight text-gray-dark">
        Book a 1:1 with a coach
      </h3>
      <p className="mt-1 text-[11px] text-gray-light">
        Walk through your build, get unstuck, or prep for the next session.
      </p>
      <div className="mt-4">
        <LinkButton size="sm" variant="primary" href="/browse">Browse coaches</LinkButton>
      </div>
    </section>
  );
}
