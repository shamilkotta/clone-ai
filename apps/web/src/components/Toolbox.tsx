"use client";

import React, { useMemo, useState } from "react";
import { PlusIcon as Plus, LogIn, Sidebar, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { ExpandableTabs, TabItem } from "./ui/expandable-tabs";
import { useSidebar } from "./ui/sidebar";
import { useChatContext } from "@/context/Chat";
import SeachDialog from "./Search";

const Toolbox = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const { toggleSidebar, setIsNewChat } = useSidebar();
  const { setMessages } = useChatContext();
  const router = useRouter();
  const pathname = usePathname();
  const [openSearch, setOpenSearch] = useState(false);

  const newChat = () => {
    if (pathname === "/") {
      setMessages?.([]);
    }
    setIsNewChat?.(true);
    router.push("/");
  };

  const tabs: TabItem[] = useMemo(() => {
    if (isLoggedIn) {
      return [
        { icon: Sidebar, onClick: toggleSidebar },
        { title: "⌘K", icon: Search, onClick: () => setOpenSearch(true) },
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
  }, [isLoggedIn, toggleSidebar, setMessages, pathname]);

  return (
    <>
      <ExpandableTabs tabs={tabs} className="fixed top-4 left-4 z-10" />
      <SeachDialog open={openSearch} setOpen={setOpenSearch} />
    </>
  );
};

export default Toolbox;
