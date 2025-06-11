import React from "react";
import Input from "@/components/Input";

const Chat = () => {
  return (
    <div className="dark">
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-white dark:bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
        <div>
          <div className="chat-ui flex grow shrink flex-col items-center justify-center h-dvh">
            <h1 className="text-center text-xl mb-3.5 font-bold text-gray-900 dark:text-gray-50 sm:text-4xl">
              Good To See You! <br />
              <span className="animate-text-gradient inline-flex bg-gradient-to-r from-neutral-900 via-slate-500 to-neutral-500 bg-[200%_auto] bg-clip-text leading-tight text-transparent dark:from-neutral-100 dark:via-slate-400 dark:to-neutral-400">
                How Can I Help You?
              </span>
            </h1>
            <Input />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
