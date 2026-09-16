import { PlaceholderSection } from "../components/SettingsSections";

// Standalone "Refer a friend" surface — promoted out of the Account page's tabs
// into its own My Leland sidebar tab. Content reuses the shared placeholder.
export default function ReferFriend() {
  return (
    <div className="pb-6">
      <h1 className="font-serif text-[30px] font-medium leading-[1.1] text-gray-dark md:text-[38px]">
        Refer a friend
      </h1>
      <PlaceholderSection />
    </div>
  );
}
