"use client";

import { useChatContext } from "@/context/Chat";
import React from "react";

const Bg = () => {
  const { messages } = useChatContext();

  if (messages && messages.length > 0) return null;

  return (
    <div className="overflow-hidden absolute -z-10 inset-0 w-full h-full">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full mix-blend-normal filter blur-[128px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full mix-blend-normal filter blur-[128px]  delay-700" />
      <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-fuchsia-500/10 rounded-full mix-blend-normal filter blur-[96px]  delay-1000" />
    </div>
  );
};

export default Bg;
