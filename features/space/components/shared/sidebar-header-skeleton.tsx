import { SidebarMenuItem, SidebarMenuSkeleton } from "@/components/ui/sidebar";

const SidebarHeaderSkeleton = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      {Array.from({ length: 2 }).map((_, index) => (
        <SidebarMenuItem
          key={index}
          className="w-full flex flex-col items-center justify-center"
        >
          <SidebarMenuSkeleton className="w-full" />
        </SidebarMenuItem>
      ))}
    </div>
  );
};

export default SidebarHeaderSkeleton;
