"use client";

import { use, useMemo } from "react";
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
import { getAllThreads } from "@/services/api";
import { Thread } from "@repo/db";

export function NavThreads({
  threadsPromise,
}: {
  threadsPromise: Promise<Thread[]>;
}) {
  const { isMobile } = useSidebar();
  const initialThreads = use(threadsPromise);

  const {
    data: threads,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["threads"],
    queryFn: ({ pageParam }) => getAllThreads(pageParam),
    initialData: () => ({ pages: [initialThreads], pageParams: [0] }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages, lastParam) =>
      lastPage.length > 0 ? lastParam + 1 : null,
    retry: 1,
    enabled: false,
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

    threads.pages.forEach((page) => {
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
      {Object.entries(groupedThreads).map(([group, items]) => {
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
              {items.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild>
                    <Link href={`/chat/${item.id}`} title={item.title}>
                      <span>{item.title || "New Chat"}</span>
                    </Link>
                  </SidebarMenuButton>
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
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
        );
      })}
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
