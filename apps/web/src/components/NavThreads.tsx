"use client";

import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  Link as LinkIcon,
  MoreHorizontal,
  Trash2,
  LoaderCircle,
  Star,
} from "lucide-react";
import Link from "next/link";
import { isToday, isYesterday } from "date-fns";
import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { getAllThreads, getThread } from "@/services/api";
import { Thread } from "@repo/db";
import { Skeleton } from "@/components/ui/skeleton";

export function NavThreads() {
  const pathname = usePathname();
  const { cThread } = useSidebar();

  const {
    data: threads,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["threads"],
    queryFn: ({ pageParam }) => getAllThreads(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages, lastParam) =>
      lastPage?.length > 0 ? lastParam + 1 : null,
    retry: 1,
    staleTime: Infinity,
  });

  const loadMore = () => {
    fetchNextPage();
  };

  const groupedThreads = useMemo(() => {
    const grouped: Record<string, Thread[]> = {
      today: [],
      yesterday: [],
      older: [],
    };

    threads?.pages.forEach((page) => {
      page.forEach((thread) => {
        const createdAt = new Date(thread.updatedAt);
        if (isToday(createdAt)) {
          grouped.today!.push(thread);
        } else if (isYesterday(createdAt)) {
          grouped.yesterday!.push(thread);
        } else {
          grouped.older!.push(thread);
        }
      });
    });

    return grouped;
  }, [threads]);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <>
        <SidebarGroupLabel className="mt-2">Current</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            {cThread ? (
              <>
                <SidebarMenuButton isActive asChild>
                  <Link
                    suppressHydrationWarning
                    href={`/chat/${cThread.id}`}
                    title={cThread.title}
                  >
                    <span suppressHydrationWarning>
                      {cThread.title || "New Chat"}
                    </span>
                  </Link>
                </SidebarMenuButton>
                <ThreadDropdown item={cThread} />
              </>
            ) : (
              <SidebarMenuButton isActive asChild>
                <Link suppressHydrationWarning href="/" title="New Chat">
                  <span suppressHydrationWarning>New Chat</span>
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </>

      {isLoading ? (
        <div className="mt-6 flex flex-col gap-2.5 px-2.5">
          <Skeleton className="h-3 w-[30%] mb-3" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[80%]" />
          <Skeleton className="h-4 w-[70%]" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[60%]" />
          <Skeleton className="h-4 w-[90%]" />
        </div>
      ) : (
        Object.entries(groupedThreads).map(([group, items]) => {
          if (items.length === 0) return null;
          return (
            <div key={group}>
              <SidebarGroupLabel className="mt-2">
                {group === "today"
                  ? "Today"
                  : group === "yesterday"
                    ? "Yesterday"
                    : "Older"}
              </SidebarGroupLabel>
              <SidebarMenu>
                <AnimatePresence>
                  {items.map((item) => {
                    const isActive = pathname === `/chat/${item.id}`;
                    return (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton isActive={isActive} asChild>
                          <Link href={`/chat/${item.id}`} title={item.title}>
                            <span>{item.title || "New Chat"}</span>
                          </Link>
                        </SidebarMenuButton>
                        <ThreadDropdown item={item} />
                      </SidebarMenuItem>
                    );
                  })}
                </AnimatePresence>
              </SidebarMenu>
            </div>
          );
        })
      )}

      {hasNextPage && (
        <SidebarMenuItem className="list-none mt-2">
          <SidebarMenuButton
            disabled={isFetchingNextPage}
            className="text-sidebar-foreground/70 cursor-pointer"
            onClick={loadMore}
          >
            {isFetchingNextPage ? (
              <LoaderCircle className="animate-[spin_2s_linear_infinite]" />
            ) : (
              <MoreHorizontal />
            )}
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
    </SidebarGroup>
  );
}

const ThreadDropdown = ({ item }: { item: Thread }) => {
  const { isMobile } = useSidebar();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuAction showOnHover>
          <MoreHorizontal />
          <span className="sr-only">More</span>
        </SidebarMenuAction>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 rounded-lg"
        side={isMobile ? "bottom" : "right"}
        align={isMobile ? "end" : "start"}
      >
        <DropdownMenuItem disabled>
          <Star className="text-muted-foreground" />
          <span>Add To Favorites</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard.writeText(
              `${window.location.origin}/chat/${item.id}`,
            );
          }}
        >
          <LinkIcon className="text-muted-foreground" />
          <span>Copy Link</span>
        </DropdownMenuItem>

        <Link
          href={`/chat/${item.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <DropdownMenuItem>
            <ArrowUpRight className="text-muted-foreground" />
            <span>Open in New Tab</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <Trash2 className="text-muted-foreground" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};