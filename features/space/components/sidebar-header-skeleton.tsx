import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";

const SidebarHeaderSkeleton = () => {
  return (
    <SidebarMenu>
      {Array.from({ length: 4 }).map((_, index) => (
        <SidebarMenuItem
          key={index}
          className="w-full flex flex-col items-center justify-center"
        >
          <SidebarMenuSkeleton className="w-full" />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export default SidebarHeaderSkeleton;
