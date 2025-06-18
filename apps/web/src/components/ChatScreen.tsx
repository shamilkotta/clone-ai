"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import Markdown from "react-markdown";
import { rehypeInlineCodeProperty } from "react-shiki";
import remarkGfm from "remark-gfm";
import { usePathname } from "next/navigation";

import CodeHighlight from "./CodeHighlight";
import { useChatContext } from "@/context/Chat";
import Greeting from "./greeting";
import { cn } from "@/lib/utils";
import TypingDots from "./ui/typing-dots";

type Props = {
  suggestions?: any;
  userName?: string | null;
};

const ChatScreen = ({ suggestions, userName }: Props) => {
  const { messages, status, setMessages, error } = useChatContext();
  const pathName = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (pathName == "/") {
      setMessages?.([]);
    }
    return () => {};
  }, [pathName]);

  return (
    <div
      ref={ref}
      className={cn(
        "overflow-y-auto flex flex-col-reverse w-full max-h-screen text-white bg-transparent px-3 md:px-0",
        messages && messages.length > 0 ? "pb-36 h-dvh" : "pb-0",
      )}
    >
      <div>
        <Greeting userName={userName} suggestions={suggestions} />
        <div className="w-full max-w-3xl mx-auto py-4">
          {messages?.length != 0 && (
            <div className="chat-message flex gap-3 flex-col mb-0 grow dark:text-white text-neutral-900 pb-2.5">
              {messages?.map((message) =>
                message.role == "user" ? (
                  <AnimatePresence key={message.id}>
                    <motion.div
                      className="backdrop-blur-2xl mb-4 dark:bg-white/[0.05] bg-neutral-900/[0.05] rounded-lg rounded-tr-none px-4 py-2 dark:shadow-lg shadow-sm border dark:border-white/[0.05] border-neutral-900/[0.05] ml-auto mr-0"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                    >
                      <div className="whitespace-pre-wrap">
                        {message.parts.map((part, i) => {
                          switch (part.type) {
                            case "text":
                              return (
                                <div key={`${message.id}-${i}`}>
                                  {part.text}
                                </div>
                              );
                          }
                        })}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <div
                    key={message.id}
                    className="flex flex-col gap-6 mb-5 whitespace-normal"
                  >
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case "text":
                          return (
                            <Markdown
                              key={`${message.id}-${i}`}
                              rehypePlugins={[rehypeInlineCodeProperty]}
                              components={{
                                code: CodeHighlight,
                              }}
                              remarkPlugins={[remarkGfm]}
                            >
                              {part.text}
                            </Markdown>
                          );
                      }
                    })}
                  </div>
                ),
              )}
              {status == "submitted" && <TypingDots />}
              {error && (
                <div className="px-3 py-4 border border-red-600 rounded-lg text-red-700">
                  <p>{error.message}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
