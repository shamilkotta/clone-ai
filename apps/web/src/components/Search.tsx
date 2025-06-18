"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import useDebounce from "@/hooks/use-debounce";
import { getAllThreads, searchThreads } from "@/services/api";
import { useSidebar } from "./ui/sidebar";

export default function SeachDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { debounce } = useDebounce({ delay: 500 });
  const [query, setQuery] = React.useState("");
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const { data } = useQuery({
    queryKey: ["threads", 0],
    queryFn: () => getAllThreads(0, 10),
    staleTime: Infinity,
    retry: 0,
  });

  const { data: searchRes, isFetching } = useQuery({
    queryKey: ["threads", query],
    queryFn: () => searchThreads(query),
    enabled: Boolean(query),
  });

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.trim() == "") return;

    debounce(() => {
      setQuery(value);
    });
  };

  return (
    <>
      <CommandDialog
        className="dark:bg-neutral-900/[0.8] bg-white/[0.8]"
        open={open}
        onOpenChange={setOpen}
      >
        <CommandInput
          isLoading={isFetching}
          onInput={onInput}
          placeholder="Search..."
        />
        <CommandList>
          {searchRes && searchRes.length > 0 ? (
            <CommandGroup heading="Results">
              {searchRes.map((thread) => (
                <CommandItem
                  onSelect={() => {
                    router.push(`/chat/${thread.id}`);
                  }}
                  key={thread.id}
                  onFocus={() => {
                    router.prefetch(`/chat/${thread.id}`);
                  }}
                >
                  <span className="font-semibold">{thread.title}</span>
                  <span className="text-muted-foreground">
                    {new Date(thread.updatedAt).toLocaleDateString()}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : ((!searchRes || !searchRes.length) &&
              query.length &&
              !isFetching) ||
            !data ||
            !data.length ? (
            <CommandEmpty>No results found.</CommandEmpty>
          ) : (
            <CommandGroup heading="Results">
              {data.map((thread) => (
                <CommandItem key={thread.id}>
                  <span className="font-semibold">{thread.title}</span>
                  <span className="text-muted-foreground">
                    {new Date(thread.updatedAt).toLocaleDateString()}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
