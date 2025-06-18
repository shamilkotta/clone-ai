import React from "react";

import ChatInput from "@/components/ChatInput";
import ChatContext from "@/context/Chat";
import ChatScreen from "@/components/ChatScreen";
import Bg from "@/components/Bg";
import { getQuerySuggestions } from "@/services/actions";
import { currentUser } from "@clerk/nextjs/server";
import Toolbox from "@/components/Toolbox";
import { unstable_cache } from "next/cache";

export const experimental_ppr = true;

const getCachedSuggestions = unstable_cache(
  getQuerySuggestions,
  ["suggestions"],
  {
    revalidate: 60 * 60,
  },
);

const Chat = async () => {
  const querySuggestions = await getCachedSuggestions();
  const user = await currentUser();
  const userName = user?.lastName || user?.firstName || user?.fullName;

  return (
    <ChatContext>
      <Toolbox isLoggedIn={Boolean(user)} />
      <main className="relative h-screen w-full flex flex-col justify-center items-center">
        <Bg />
        <ChatScreen userName={userName} suggestions={querySuggestions} />
        <ChatInput animate />
      </main>
    </ChatContext>
  );
};

export default Chat;
