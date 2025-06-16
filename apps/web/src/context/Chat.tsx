"use client";

import React, { PropsWithChildren } from "react";
import { useChat, UseChatHelpers } from "@ai-sdk/react";

const Chat = React.createContext<Partial<UseChatHelpers>>({});
export const useChatContext = () => React.use(Chat);
const ChatContext = ({ children }: PropsWithChildren) => {
  const chatprops = useChat();

  return <Chat.Provider value={chatprops}>{children}</Chat.Provider>;
};

export default ChatContext;
