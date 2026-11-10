// Recurring memberships (a.k.a. subscriptions). The prototype's offerings don't
// model a billing cadence, so memberships are their own small catalog: a
// monthly/annual price, a member count, and the perks each tier includes.
import membershipImg1 from "../assets/placeholder images/courses/Hero_Pay_Transparency_Blog_6afbaac6f3.avif";
import membershipImg2 from "../assets/placeholder images/courses/toolkit_visa_eligibility_tool_52ed4c99da.avif";

export type SubscriptionPlan = {
  slug: string;
  title: string;
  headline: string;
  monthly: number;
  annual: number;
  members: number;
  image?: string;
  perks: string[];
};

export const SUBSCRIPTIONS: SubscriptionPlan[] = [
  {
    slug: "mba-insider-membership",
    title: "MBA Insider Membership",
    headline: "Monthly group coaching, live Q&A, and a members-only resource library.",
    monthly: 49,
    annual: 490,
    members: 128,
    image: membershipImg1,
    perks: ["2 live group sessions / month", "Members-only content library", "Priority essay feedback"],
  },
  {
    slug: "premium-mentorship",
    title: "Premium 1:1 Mentorship",
    headline: "A standing monthly 1:1, unlimited async review, and full content access.",
    monthly: 299,
    annual: 2990,
    members: 24,
    image: membershipImg2,
    perks: ["Monthly 1:1 coaching call", "Unlimited async essay review", "Everything in Insider"],
  },
];

export function getSubscriptionBySlug(slug: string | undefined): SubscriptionPlan | undefined {
  return SUBSCRIPTIONS.find((s) => s.slug === slug);
}
