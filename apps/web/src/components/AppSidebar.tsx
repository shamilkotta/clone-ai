import { currentUser } from "@clerk/nextjs/server";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "./NavUser";
import { NavThreads } from "./NavThreads";

export async function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const user = await currentUser();
  if (!user) return null;

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader className="h-14" />
      <SidebarContent>
        <NavThreads />
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <NavUser
          user={{
            name: user.fullName || user.firstName || user.lastName || "",
            email: user.primaryEmailAddress?.emailAddress || "",
            avatar: user.imageUrl,
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
