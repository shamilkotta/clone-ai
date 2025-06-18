"use client";

import React, { Suspense, useState } from "react";
import {
  MonitorIcon,
  Sparkles,
  CodeXmlIcon,
  BookOpenTextIcon,
} from "lucide-react";
import { motion } from "framer-motion";

import Suggestions from "./Suggestions";
import { useChatContext } from "@/context/Chat";

interface CommandSuggestion {
  icon: React.ReactNode;
  label: string;
  key: string;
}

type QuerySuggestions = Record<string, string[]>;
type Props = {
  suggestions?: QuerySuggestions;
  userName?: string | null;
};

const commandSuggestions: CommandSuggestion[] = [
  {
    icon: <Sparkles className="w-4 h-4" />,
    label: "Create",
    key: "create",
  },
  {
    icon: <MonitorIcon className="w-4 h-4" />,
    label: "Explore",
    key: "explore",
  },
  {
    icon: <CodeXmlIcon className="w-4 h-4" />,
    label: "Code",
    key: "code",
  },
  {
    icon: <BookOpenTextIcon className="w-4 h-4" />,
    label: "Learn",
    key: "learn",
  },
];

const Greeting = (props: Props) => {
  const [currentSelected, setCurrentSelected] = useState("Create");
  const { messages } = useChatContext();
  const username = props.userName;

  if (messages && messages?.length > 0) return null;

  return (
    <motion.div
      className={`relative space-y-6 flex flex-col mb-8`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-block"
        >
          <h1 className="pb-1  font-bold tracking-tight text-transparent bg-clip-text text-4xl dark:bg-white/90 bg-neutral-900">
            Good To See You{username ? `, ${username}` : ""}!
          </h1>
          <h1 className="pb-1  font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r text-4xl from-neutral-900 to-neutral-500 dark:from-white/90 dark:to-white/40">
            How can I help you?
          </h1>
          <motion.div
            className="h-px bg-gradient-to-r from-transparent to-transparent dark:via-white/20 via-neutral-900/20"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
        </motion.div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center items-center">
        {commandSuggestions.map((suggestion, index) => {
          const isSelected = suggestion.label === currentSelected;
          return (
            <motion.button
              key={suggestion.key}
              onClick={() =>
                setCurrentSelected(commandSuggestions[index]!.label)
              }
              className={`flex cursor-pointer items-center gap-2 px-3 py-2  
                hover:bg-neutral-900/[0.05] dark:hover:bg-white/[0.05] rounded-lg text-sm 
                hover:text-neutral-900/90 dark:hover:text-white/90 transition-all relative group
                ${
                  isSelected
                    ? "bg-neutral-900/[0.05] dark:bg-white/[0.05] text-neutral-900/90 dark:text-white/90"
                    : "bg-neutral-900/[0.02] dark:bg-white/[0.02] text-neutral-900/60 dark:text-white/60 "
                }
              `}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {suggestion.icon}
              <span>{suggestion.label}</span>
              <motion.div
                className="absolute inset-0 border border-neutral-900/[0.05] dark:border-white/[0.05] rounded-lg"
                initial={false}
                animate={{
                  opacity: [0, 1],
                  scale: [0.98, 1],
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
              />
            </motion.button>
          );
        })}
      </div>
      <div className="flex w-fit min-w-[min(90vw,600px)] flex-col justify-center mx-auto items-start">
        <Suspense
          fallback={
            <>
              {[1, 2, 3, 4].map((el) => (
                <div
                  key={el}
                  className="rounded-lg w-full h-6 animate-pulse my-1.5 bg-neutral-900/[0.09] dark:bg-white/[0.09]"
                ></div>
              ))}
            </>
          }
        >
          <Suggestions
            currentSelected={currentSelected}
            suggestions={props.suggestions}
          />
        </Suspense>
      </div>
    </motion.div>
  );
};

export default Greeting;
