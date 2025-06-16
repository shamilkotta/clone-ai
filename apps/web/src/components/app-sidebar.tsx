import { currentUser } from "@clerk/nextjs/server";
import { ChevronsUpDown, User } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { NavUser } from "./nav-user";

export async function AppSidebar() {
  const user = await currentUser();
  if (!user) return null;

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
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
