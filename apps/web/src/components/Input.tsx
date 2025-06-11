"use client";

import React, { useRef } from "react";
import "./index.css";
import { Send } from "lucide-react";

const Input = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const onInput = () => {
    inputRef.current!.style.height = "auto";
    inputRef.current!.style.height = `${inputRef.current?.scrollHeight || 40}px`;
  };

  return (
    <div
      className="max-w-8/10 w-full sm:max-w-[700px] border
      border-zinc-600 rounded-xl "
    >
      <textarea
        autoComplete="off"
        ref={inputRef}
        rows={2}
        onSubmit={() => {
          alert("hiii");
        }}
        onInput={onInput}
        placeholder="Ask anything..."
        className="w-full outline-none bg-transparent px-4 py-1.5 max-h-52 text-lg text-gray-900 dark:text-gray-50 transition-all duration-300 ease-out"
      />

      <div className="px-2 py-1">
        <button
          className="p-2 flex mr-0 ml-auto w-fit rounded-2xl cursor-pointer 
          text-gray-900 dark:text-gray-50 hover:text-gray-600 hover:dark:text-gray-200 disabled:text-gray-400 disabled:dark:text-gray-400 disabled:cursor-not-allowed"
          //   disabled
        >
          <Send className="" />
        </button>
      </div>
    </div>
  );
};

export default Input;
