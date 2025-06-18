"use client";

import { useQueryClient } from "@tanstack/react-query";
import React, { PropsWithChildren, useCallback, useState } from "react";
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
  setIsNewChat: (isNew: boolean) => void;
  setTempId: (id: string | null) => void;
}

const Chat = React.createContext<Partial<ChatContextType>>({});
export const useChatContext = () => React.use(Chat);
const ChatContext = ({ children, thread }: PropsWithChildren<Props>) => {
  const queryClient = useQueryClient();
  const [isNewChat, setIsNewChat] = useState(false);
  const [tempId, setTempId] = useState<string | null>(null);

  const onFinish = useCallback(
    async (isRes?: boolean) => {
      if (isNewChat) {
        queryClient.invalidateQueries({
          queryKey: ["threads"],
        });
        if (!isRes) setIsNewChat(false);
      }
    },
    [isNewChat, queryClient, tempId],
  );

  const chatprops = useChat({
    initialMessages: (thread?.messages || []) as unknown as Message[],
    onFinish: () => onFinish(false),
    onResponse: () => onFinish(true),
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
        setIsNewChat,
        setTempId,
      }}
    >
      {children}
    </Chat.Provider>
  );
};

export default ChatContext;
