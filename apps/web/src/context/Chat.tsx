"use client";

import React, { PropsWithChildren, useState } from "react";
import { Message, useChat, UseChatHelpers } from "@ai-sdk/react";
import { Thread, Message as DBMessage } from "@repo/db";

interface ThreadMessage extends Thread {
  messages: DBMessage[];
}
type Props = {
  thread?: ThreadMessage | null;
};

interface ChatContextType extends UseChatHelpers {
  threadId?: string;
  currentModel: string;
  setCurrentModel: (model: string) => void;
}

const Chat = React.createContext<Partial<ChatContextType>>({});
export const useChatContext = () => React.use(Chat);
const ChatContext = ({ children, thread }: PropsWithChildren<Props>) => {
  const chatprops = useChat({
    initialMessages: (thread?.messages || []) as unknown as Message[],
  });
  let selectedModel = "models/gemini-2.0-flash-exp";
  if (typeof window != "undefined")
    selectedModel =
      window?.localStorage?.getItem("selectedModel") || selectedModel;
  const [currentModel, setCurrentModel] = useState(selectedModel);

  return (
    <Chat.Provider
      value={{
        ...chatprops,
        threadId: thread?.id,
        currentModel,
        setCurrentModel,
      }}
    >
      {children}
    </Chat.Provider>
  );
};

export default ChatContext;
