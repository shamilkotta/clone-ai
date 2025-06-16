import React, { Suspense } from "react";
import { redirect } from "next/navigation";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import ChatContext from "@/context/Chat";
import ChatScreen from "@/components/ChatScreen";
import ChatInput from "@/components/ui/chat-input";
import Toolbox from "@/components/Toolbox";

const Chat = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  if (!id) {
    redirect(`/`);
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <Suspense fallback={<></>}>
        <AppSidebar />
      </Suspense>
      <ChatContext>
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
