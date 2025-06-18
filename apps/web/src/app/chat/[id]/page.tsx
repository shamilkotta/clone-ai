import React, { cache } from "react";
import { redirect } from "next/navigation";

import ChatContext from "@/context/Chat";
import ChatScreen from "@/components/ChatScreen";
import ChatInput from "@/components/ChatInput";
import { getThreadMessages } from "@/services/actions";
import Toolbox from "@/components/Toolbox";

type Params = { params: Promise<{ id: string }> };

const loadThreadData = cache(getThreadMessages);
export async function generateMetadata({ params }: Params) {
  const { id } = await params;
  const thread = await loadThreadData(id);

  if (!thread) {
    return {
      title: "CloneAI",
      description: "Another clone of ChatGPT",
    };
  }

  return {
    title: thread.title,
    description: "Another clone of ChatGPT",
  };
}

const Chat = async ({ params }: Params) => {
  const { id } = await params;
  const thread = await loadThreadData(id);
  if (!thread) redirect("/");

  return (
    <ChatContext thread={thread}>
      <Toolbox isLoggedIn={true} />
      <main className="relative h-screen w-full flex flex-col justify-center items-center">
        <ChatScreen />
        <ChatInput animate={false} />
      </main>
    </ChatContext>
  );
};

export default Chat;
