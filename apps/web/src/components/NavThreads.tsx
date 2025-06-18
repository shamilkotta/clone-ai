"use client";

import { useMemo } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  ArrowUpRight,
  MoreHorizontal,
  Trash2,
  LoaderCircle,
  Star,
  ShareIcon,
} from "lucide-react";
import Link from "next/link";
import { isToday, isYesterday } from "date-fns";
import { AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

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
import { deleteThread, getAllThreads } from "@/services/api";
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
          <SidebarMenuItem suppressHydrationWarning>
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
              <>
                <SidebarMenuButton isActive asChild>
                  <Link suppressHydrationWarning href="/" title="New Chat">
                    <span suppressHydrationWarning>New Chat</span>
                  </Link>
                </SidebarMenuButton>
                <EmptyThreadDropdown />
              </>
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

const EmptyThreadDropdown = () => {
  const { isCurrentLoading } = useSidebar();

  if (isCurrentLoading)
    return (
      <SidebarMenuAction>
        <LoaderCircle size={18} className="animate-[spin_2s_linear_infinite]" />
      </SidebarMenuAction>
    );

  return null;
};

const ThreadDropdown = ({ item }: { item: Thread }) => {
  const { isMobile } = useSidebar();
  const queryClient = useQueryClient();
  const router = useRouter();
  const {
    setIsCurrentLoading,
    isCurrentLoading,
    cThread,
    setCThread,
    setIsNewChat,
  } = useSidebar();

    const { mutate, isPending } = useMutation({
      mutationFn: deleteThread,
      onSuccess: (_, threadId) => {
        queryClient.invalidateQueries({
          queryKey: ["threads"],
        });
        setIsCurrentLoading(false);
        if (cThread?.id == threadId) {
          setCThread(null);
          setIsNewChat(true);
          router.push("/");
        }
      },
    });
  const isLoading = isPending || (isCurrentLoading && item.id === cThread?.id);

  const handleDelete = () => {
    if (item.id === cThread?.id) {
      setIsCurrentLoading(true);
    }
    mutate(item.id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={isLoading} asChild>
        <SidebarMenuAction showOnHover={!isLoading}>
          {isLoading ? (
            <LoaderCircle
              size={18}
              className="animate-[spin_2s_linear_infinite]"
            />
          ) : (
            <>
              <MoreHorizontal />
              <span className="sr-only">More</span>
            </>
          )}
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
        <DropdownMenuItem disabled>
          <ShareIcon className="text-muted-foreground" />
          <span>Share</span>
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
        <DropdownMenuItem onClick={handleDelete}>
          <Trash2 className="text-muted-foreground" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};