"use client";

import React, { PropsWithChildren } from "react";
import { Message, useChat, UseChatHelpers } from "@ai-sdk/react";

type Props = {
  thread?: Thread<Message>;
};

interface ChatContextType extends UseChatHelpers {
  threadId?: string;
}

const Chat = React.createContext<Partial<ChatContextType>>({});
export const useChatContext = () => React.use(Chat);
const ChatContext = ({ children, thread }: PropsWithChildren<Props>) => {
  const chatprops = useChat({
    initialMessages: thread?.messages || [],
  });

  return (
    <Chat.Provider value={{ ...chatprops, threadId: thread?.id }}>
      {children}
    </Chat.Provider>
  );
};

export default ChatContext;
