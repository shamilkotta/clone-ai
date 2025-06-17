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
import { getAllThread } from "@/services/actions";
import { Suspense } from "react";
import { headers } from "next/headers";

export async function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const user = await currentUser();
  const heads = await headers();
  const pathname = heads.get("next-url");
  if (!user || pathname?.includes("profile")) return null;
  const threads = getAllThread(user);

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader className="h-14" />
      <SidebarContent>
        <Suspense fallback={<div className="mt-14"></div>}>
          <NavThreads threadsPromise={threads} />
        </Suspense>
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

// This is sample data.
const data = {
  favorites: [
    {
      name: "Project Management & Task Tracking",
      url: "#",
      emoji: "📊",
    },
    {
      name: "Family Recipe Collection & Meal Planning",
      url: "#",
      emoji: "🍳",
    },
    {
      name: "Fitness Tracker & Workout Routines",
      url: "#",
      emoji: "💪",
    },
    {
      name: "Book Notes & Reading List",
      url: "#",
      emoji: "📚",
    },
    {
      name: "Sustainable Gardening Tips & Plant Care",
      url: "#",
      emoji: "🌱",
    },
    {
      name: "Language Learning Progress & Resources",
      url: "#",
      emoji: "🗣️",
    },
    {
      name: "Home Renovation Ideas & Budget Tracker",
      url: "#",
      emoji: "🏠",
    },
    {
      name: "Personal Finance & Investment Portfolio",
      url: "#",
      emoji: "💰",
    },
    {
      name: "Movie & TV Show Watchlist with Reviews",
      url: "#",
      emoji: "🎬",
    },
    {
      name: "Daily Habit Tracker & Goal Setting",
      url: "#",
      emoji: "✅",
    },
  ],
};
