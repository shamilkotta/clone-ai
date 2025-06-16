"use client";

import React, { useEffect, useState } from "react";
import {
  PlusIcon as Plus,
  LogIn,
  Sidebar,
  Search,
  LoaderCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

import { ExpandableTabs, TabItem } from "./ui/expandable-tabs";
import { useSidebar } from "./ui/sidebar";

const Toolbox = () => {
  const { toggleSidebar } = useSidebar();
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  const [tabs, setTabs] = useState<TabItem[]>([
    {
      icon: LoaderCircle,
      iconProps: {
        className: "animate-[spin_2s_linear_infinite]",
      },
    },
    {
      title: "New",
      icon: Plus,
      onClick: () => {
        window.location.reload();
      },
    },
  ]);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setTabs([
        { icon: Sidebar, onClick: toggleSidebar },
        { title: "⌘K", icon: Search },
        { type: "separator" },
        {
          title: "New",
          icon: Plus,
          onClick: () => {
            window.location.reload();
          },
        },
      ]);
    } else if (isLoaded) {
      setTabs([
        {
          title: "Login",
          icon: LogIn,
          alwaysShow: true,
          onClick: () => {
            router.push("/sign-in");
          },
        },
        { type: "separator" },
        {
          title: "New",
          icon: Plus,
          onClick: () => {
            window.location.reload();
          },
        },
      ]);
    }
    return () => {};
  }, [isLoaded, isSignedIn, toggleSidebar]);

  return <ExpandableTabs tabs={tabs} className="fixed top-4 left-4 z-10" />;
};

export default Toolbox;
