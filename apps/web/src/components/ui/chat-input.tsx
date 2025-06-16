"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleStop, Command, Paperclip, SendIcon, XIcon } from "lucide-react";
import { v4 as uuid } from "uuid";
import { useAuth } from "@clerk/nextjs";

import useAutoResizeTextarea from "@/hooks/use-auto-resize";
import { cn } from "@/lib/utils";
import Textarea from "./textarea";
import { useChatContext } from "@/context/Chat";

const ChatInput = () => {
  const [attachments, setAttachments] = useState<string[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  });
  const [inputFocused, setInputFocused] = useState(false);
  const { handleSubmit, handleInputChange, input, status, stop, messages } =
    useChatContext();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmitForm();
    }
  };

  const handleSubmitForm = () => {
    if (isSignedIn) {
      const id = uuid();
      console.log("id: ", id);
      window.history.pushState({}, "", "/chat/" + id);
    }
    handleSubmit?.();
    adjustHeight(true);
  };

  const handleAttachFile = () => {
    const mockFileName = `file-${Math.floor(Math.random() * 1000)}.pdf`;
    setAttachments((prev) => [...prev, mockFileName]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      className={cn(
        "relative mx-auto w-full max-w-3xl",
        messages && messages.length > 0
          ? "fixed bottom-0 left-auto right-auto z-20"
          : "",
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="relative backdrop-blur-2xl bg-neutral-900/[0.02] dark:bg-white/[0.02] rounded-2xl border border-neutral-900/[0.05] dark:border-white/[0.05] shadow-2xl"
        initial={{ scale: 0.98 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="p-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              handleInputChange?.(e);
              adjustHeight(e.target.value.trim().length == 0);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            placeholder="Ask anything..."
            containerClassName="w-full"
            className={cn(
              "px-4 py-3 w-full",
              "resize-none",
              "bg-transparent",
              "border-none",
              "text-lg text-neutral-900/90 dark:text-white/90",
              "focus:outline-none",
              "placeholder:text-neutral-900/40 dark:placeholder:text-white/20",
              "min-h-[60px]",
            )}
            showRing={false}
          />
        </div>

        {/* Attachmets */}
        <AnimatePresence>
          {attachments.length > 0 && (
            <motion.div
              className="flex flex-wrap gap-2 px-4 pb-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {attachments.map((file, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 text-xs bg-neutral-900/[0.03] dark:bg-white/[0.03] py-1.5 px-3 rounded-lg text-neutral-900/70 dark:text-white/70"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <span>{file}</span>
                  <button
                    onClick={() => removeAttachment(index)}
                    className="transition-colors text-neutral-900/40 dark:text-white/40 hover:text-neutral-900 dark:hover:text-white"
                  >
                    <XIcon className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-2 border-t border-neutral-900/[0.05] dark:border-white/[0.05] flex items-center justify-between gap-4">
          <div className="flex gap-3 items-center">
            <motion.button
              type="button"
              onClick={handleAttachFile}
              whileTap={{ scale: 0.94 }}
              disabled
              className="relative p-2 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed text-neutral-900/40 dark:text-white/40 hover:text-neutral-900/90 dark:hover:text-white/90 group"
            >
              <Paperclip className="w-4 h-4" />
              <motion.span
                className="absolute inset-0 bg-neutral-900/[0.05] dark:bg-white/[0.05] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                layoutId="button-highlight"
              />
            </motion.button>
            <motion.button
              type="button"
              data-command-button
              onClick={(e) => {
                e.stopPropagation();
              }}
              whileTap={{ scale: 0.94 }}
              className={cn(
                "p-2 cursor-pointer text-neutral-900/40 dark:text-white/40 hover:text-neutral-900/90 dark:hover:text-white/90 rounded-lg transition-colors relative group",
                false &&
                  "bg-neutral-900/10 dark:bg-white/10 text-neutral-900/90 dark:text-white/90",
              )}
            >
              <Command className="w-4 h-4" />
              <motion.span
                className="absolute inset-0 bg-neutral-900/[0.05] dark:bg-white/[0.05] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                layoutId="button-highlight"
              />
            </motion.button>
          </div>

          <motion.button
            type="button"
            onClick={
              status == "streaming" || status == "submitted"
                ? stop
                : handleSubmitForm
            }
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={!input?.trim()}
            className={cn(
              "px-3 py-3 rounded-lg cursor-pointer disabled:cursor-not-allowed text-sm font-medium transition-all",
              "flex items-center gap-2",
              input?.trim()
                ? "bg-neutral-900 dark:bg-white text-[#e8e8ff] dark:text-[#0A0A0B] shadow-lg shadow-white/10"
                : "bg-neutral-900/[0.05] dark:bg-white/[0.05] text-neutral-900/40 dark:text-white/40",
            )}
          >
            {status == "submitted" || status == "streaming" ? (
              <CircleStop className="w-4 h-4 animate-[spin_2s_linear_infinite]" />
            ) : (
              <SendIcon className="w-4 h-4" />
            )}
          </motion.button>
        </div>
      </motion.div>

      {inputFocused && (
        <motion.div
          className="fixed w-[50rem] h-[50rem] rounded-full pointer-events-none z-0 opacity-[0.02] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 blur-[96px]"
          animate={{
            x: mousePosition.x - 400,
            y: mousePosition.y - 400,
          }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 150,
            mass: 0.5,
          }}
        />
      )}
    </motion.div>
  );
};

export default ChatInput;

const rippleKeyframes = `
@keyframes ripple {
  0% { transform: scale(0.5); opacity: 0.6; }
  100% { transform: scale(2); opacity: 0; }
}
`;

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = rippleKeyframes;
  document.head.appendChild(style);
}
