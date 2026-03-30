import { useLeftSidebarContent } from "./LeftSidebarContext";

export default function LeftSidebar() {
  const content = useLeftSidebarContent();

  if (!content) return null;

  return (
    <aside className="fixed left-0 top-[52px] hidden h-[calc(100%-52px)] w-[280px] overflow-y-auto bg-white xl:block">
      <div className="px-4 py-5">
        {content}
      </div>
    </aside>
  );
}
