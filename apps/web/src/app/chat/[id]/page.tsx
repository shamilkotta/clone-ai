import React, { cache, Suspense } from "react";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import ChatContext from "@/context/Chat";
import ChatScreen from "@/components/ChatScreen";
import ChatInput from "@/components/ui/chat-input";
import Toolbox from "@/components/Toolbox";
import { getThread } from "@/services/thread";

const loadThreadData = cache(async (id: string) => {
  try {
    const user = await currentUser();
    if (!user) return;
    const thread = await getThread(id, user);
    if (!thread) return;
    return thread;
  } catch {
    return;
  }
});

type Params = { params: Promise<{ id: string }> };

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
  };
}

const Chat = async ({ params }: Params) => {
  const { id } = await params;
  const thread = await loadThreadData(id);
  if (!thread) redirect("/");

  return (
    <SidebarProvider defaultOpen={false}>
      <Suspense fallback={<></>}>
        <AppSidebar />
      </Suspense>
      <ChatContext thread={thread}>
        <Toolbox />
        <main className="relative h-screen w-full flex flex-col justify-center items-center">
          <ChatScreen />
          <ChatInput />
        </main>
      </ChatContext>
    </SidebarProvider>
  );
};

export default Chat;
