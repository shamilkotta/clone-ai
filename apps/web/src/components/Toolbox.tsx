"use client";

import React, { useMemo } from "react";
import { PlusIcon as Plus, LogIn, Sidebar, Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { ExpandableTabs, TabItem } from "./ui/expandable-tabs";
import { useSidebar } from "./ui/sidebar";
import { useChatContext } from "@/context/Chat";

const Toolbox = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const { toggleSidebar } = useSidebar();
  const { setMessages } = useChatContext();
  const router = useRouter();

  const newChat = () => {
    setMessages?.([]);
    router.push("/");
  };

  const tabs: TabItem[] = useMemo(() => {
    if (isLoggedIn) {
      return [
        { icon: Sidebar, onClick: toggleSidebar },
        { title: "⌘K", icon: Search },
        { type: "separator" },
        {
          title: "New",
          icon: Plus,
          onHover: () => {
            router.prefetch("/");
          },
          onClick: newChat,
        },
      ];
    }
    return [
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
        onClick: newChat,
      },
    ];
  }, [isLoggedIn, toggleSidebar, setMessages]);

  return <ExpandableTabs tabs={tabs} className="fixed top-4 left-4 z-10" />;
};

export default Toolbox;
