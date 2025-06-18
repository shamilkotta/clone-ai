"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Button } from "./button";

interface Tab {
  title?: string;
  icon: LucideIcon;
  type?: never;
  alwaysShow?: boolean;
  onClick?: () => void;
  onHover?: () => void;
  iconProps?: React.ComponentProps<LucideIcon>;
}

interface Separator {
  type: "separator";
  title?: never;
  icon?: never;
  alwaysShow?: never;
}

export type TabItem = Tab | Separator;

interface ExpandableTabsProps {
  tabs: TabItem[];
  className?: string;
  activeColor?: string;
  onChange?: (index: number | null) => void;
}

const buttonVariants = {
  initial: {
    gap: ".5rem",
    paddingLeft: ".5rem",
    paddingRight: ".5rem",
  },
  animate: (isSelected: boolean) => ({
    gap: isSelected ? ".5rem" : "0",
    paddingLeft: isSelected ? "1rem" : ".5rem",
    paddingRight: isSelected ? "1rem" : ".5rem",
  }),
};

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

const transition = { delay: 0.1, type: "spring", bounce: 0, duration: 0.6 };

export function ExpandableTabs({ tabs, className }: ExpandableTabsProps) {
  const [selected, setSelected] = React.useState<number | null>(null);
  const outsideClickRef = React.useRef(null);

  const Separator = () => (
    <div className="mx-1 h-[24px] w-[1.2px] bg-border" aria-hidden="true" />
  );

  return (
    <div
      ref={outsideClickRef}
      className={cn(
        "flex flex-wrap items-center gap-1 rounded-lg border border-neutral-900/[0.05] dark:border-white/[0.05] dark:bg-neutral-900/[0.8] bg-white/[0.8] p-1 shadow-sm",
        className,
      )}
    >
      {tabs.map((tab, index) => {
        if (tab.type === "separator") {
          return <Separator key={`separator-${index}`} />;
        }

        const Icon = tab.icon;
        return (
          <motion.button
            key={`${tab.title}_${index}`}
            variants={!tab.alwaysShow ? buttonVariants : {}}
            initial={false}
            animate="animate"
            custom={selected === index && tab.title}
            onClick={() => tab.onClick?.()}
            onMouseEnter={() => {
              setSelected(index);
              tab.onHover?.();
            }}
            onMouseLeave={() => setSelected(null)}
            transition={transition}
            className={cn(
              "relative cursor-pointer flex items-center rounded-lg py-2 text-sm font-medium transition-colors duration-300",
              selected === index
                ? cn("bg-muted", "text-primary")
                : "text-foreground hover:bg-muted hover:text-foreground",
              tab.alwaysShow ? "pl-1 pr-3 gap-2" : "px-2",
            )}
          >
            <Icon size={20} {...tab.iconProps} />
            <AnimatePresence initial={false}>
              {((selected === index && tab.title) || tab.alwaysShow) && (
                <motion.span
                  variants={spanVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={transition}
                  className="overflow-hidden"
                >
                  {tab.title == "⌘K" ? (
                    <div className="flex items-center">
                      <span className="mr-0.5">{tab.title[0]}</span>
                      <span>{tab.title[1]}</span>
                    </div>
                  ) : (
                    tab.title
                  )}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}
