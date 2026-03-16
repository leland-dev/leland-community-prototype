import { useRightSidebarContent } from "./RightSidebarContext";

export default function RightSidebar() {
  const content = useRightSidebarContent();

  if (!content) return null;

  return (
    <aside className="fixed right-0 top-0 hidden h-full w-[300px] overflow-y-auto bg-white xl:block">
      {content}
    </aside>
  );
}
