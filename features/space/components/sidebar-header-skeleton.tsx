import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";

const SidebarHeaderSkeleton = () => {
  return (
    <SidebarMenu>
      {Array.from({ length: 2 }).map((_, index) => (
        <SidebarMenuItem
          key={index}
          className="w-full flex flex-col items-center justify-center"
        >
          <SidebarMenuSkeleton className="w-32" />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export default SidebarHeaderSkeleton;
