"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CircleStop,
  Package,
  Paperclip,
  Pin,
  Plus,
  SendIcon,
  XIcon,
} from "lucide-react";

import useAutoResizeTextarea from "@/hooks/use-auto-resize";
import { cn } from "@/lib/utils";
import Textarea from "./ui/textarea";
import { useChatContext } from "@/context/Chat";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "./ui/sidebar";
import { MODELS } from "@/utils/models";

const ChatInput = ({ animate }: { animate?: boolean }) => {
  const [attachments, setAttachments] = useState<string[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  });
  const [inputFocused, setInputFocused] = useState(false);
  const {
    submitHandler,
    handleInputChange,
    input,
    status,
    stop,
    messages,
    setCurrentModel,
    currentModel,
    defaltModel,
    setModalAsDefault,
  } = useChatContext();
  const isMobile = useIsMobile();
  const pathName = usePathname();
  const { setOpen, setOpenMobile } = useSidebar();

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
    submitHandler?.();
    adjustHeight(true);
  };

  const handleAttachFile = () => {
    const mockFileName = `file-${Math.floor(Math.random() * 1000)}.pdf`;
    setAttachments((prev) => [...prev, mockFileName]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCloseSidebar = () => {
    setOpen(false);
    setOpenMobile(false);
  };

  const handleSelectModel = (model: SelectedModel) => {
    setCurrentModel?.({
      name: model.name,
      model: model.model,
    });
  };

  return (
    <motion.div
      className={cn(
        "relative mx-auto w-full max-w-3xl",
        messages && messages.length > 0
          ? "fixed bottom-0 left-auto right-auto z-20"
          : "",
      )}
      initial={{ opacity: animate ? 0 : 1, y: animate ? 20 : 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="relative backdrop-blur-2xl bg-neutral-900/[0.02] dark:bg-white/[0.02] rounded-2xl border border-neutral-900/[0.05] dark:border-white/[0.05] shadow-2xl"
        initial={{ scale: animate ? 0.98 : 1 }}
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
              <span className="absolute inset-0 bg-neutral-900/[0.05] dark:bg-white/[0.05] rounded-lg group-hover:opacity-100 transition-opacity" />
            </motion.button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  type="button"
                  data-command-button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  whileTap={{ scale: 0.94 }}
                  className={cn(
                    "p-2 cursor-pointer flex items-center gap-1.5 text-neutral-900/40 dark:text-white/40 hover:text-neutral-900/90 dark:hover:text-white/90 rounded-lg transition-colors relative group",
                    "focus-within:border-0",
                  )}
                >
                  <Package className="w-4 h-4" />
                  <span className="text-xs max-w-[170px] overflow-hidden text-nowrap text-ellipsis">
                    {currentModel?.name}
                  </span>
                  <span className="absolute inset-0 bg-neutral-900/[0.05] dark:bg-white/[0.05] rounded-lg group-hover:opacity-100 transition-opacity" />
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem disabled>
                  <span>Your Models</span>
                </DropdownMenuItem>
                <Link
                  href={`/profile/models?ref=${pathName}`}
                  onClick={handleCloseSidebar}
                >
                  <DropdownMenuItem>
                    <Plus />
                    <span>Add Model</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                {MODELS.map((model) => (
                  <DropdownMenuItem
                    key={model.model}
                    className={cn(
                      currentModel?.model == model.model ? "bg-accent/60" : "",
                      "group relative",
                    )}
                    onClick={() => {
                      handleSelectModel(model);
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-xs">{model.name}</span>
                      {model.model == defaltModel?.model && (
                        <span className="text-xs text-green-500">Default</span>
                      )}
                    </span>
                    {model.model !== defaltModel?.model && (
                      <span
                        onClick={() => setModalAsDefault?.(model)}
                        className="absolute cursor-pointer hidden rounded-full p-1 hover:bg-white/30 right-1 left-auto top-auto bottom-auto group-hover:block"
                      >
                        <Pin />
                      </span>
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem disabled>
                  <span className="text-xs text-neutral-900/40 dark:text-white/40">
                    More models coming soon!
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
            disabled={!input?.trim() && status != "streaming"}
            className={cn(
              "px-3 py-3 rounded-lg cursor-pointer disabled:cursor-not-allowed text-sm font-medium transition-all",
              "flex items-center gap-2",
              input?.trim() || status == "streaming"
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
