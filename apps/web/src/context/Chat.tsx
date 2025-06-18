"use client";

import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Message, useChat, UseChatHelpers } from "@ai-sdk/react";
import { v4 as uuid } from "uuid";
import { useAuth } from "@clerk/nextjs";

import { Thread, Message as DBMessage } from "@repo/db";
import { useSidebar } from "@/components/ui/sidebar";
import { getThread } from "@/services/api";
import { MODELS } from "@/utils/models";

interface ThreadMessage extends Thread {
  messages: DBMessage[];
}
type Props = {
  thread?: ThreadMessage | null;
};

interface ChatContextType extends UseChatHelpers {
  currentModel: SelectedModel;
  setCurrentModel: (model: SelectedModel) => void;
  submitHandler: () => void;
  setIsNewChat?: (isNew: boolean) => void;
  defaltModel: SelectedModel;
  setModalAsDefault: (model: SelectedModel) => void;
}

const Chat = React.createContext<Partial<ChatContextType>>({});
export const useChatContext = () => React.use(Chat);
const ChatContext = ({ children, thread }: PropsWithChildren<Props>) => {
  const queryClient = useQueryClient();
  const newId = uuid();
  const [isNewChat, setIsNewChat] = useState(Boolean(!thread?.id));
  const [tempId, setTempId] = useState<string>(thread?.id || newId);
  const { setCThread } = useSidebar();
  const { isSignedIn } = useAuth();

  const onFinish = useCallback(() => {
    if (isNewChat) {
      queryClient
        .fetchQuery({
          queryKey: ["thread", tempId],
          queryFn: () => getThread(tempId!),
          retry: 5,
          retryDelay: 1000,
          staleTime: Infinity,
        })
        .then((threadData) => {
          setCThread(threadData);
          queryClient.setQueryData<InfiniteData<Thread[]>>(
            ["threads"],
            (oldData) => {
              let newData;
              if (oldData?.pages?.[0] && threadData) {
                newData = [...oldData?.pages];
                newData[0] = [threadData, ...(newData[0] || [])];
              }
              return {
                pages: newData,
                pageParams: oldData?.pageParams,
              } as InfiniteData<Thread[]>;
            },
          );
          setIsNewChat(false);
        })
        .catch((err) => {});
    }
  }, [isNewChat, queryClient, tempId]);

  const chatprops = useChat({
    initialMessages: (thread?.messages || []) as unknown as Message[],
    onFinish,
  });

  let selectedModel = {
    name: MODELS[0]?.name,
    model: MODELS[0]?.model,
  } as SelectedModel;
  if (typeof window != "undefined") {
    const defaultSel = window?.localStorage?.getItem("selectedModel");
    if (defaultSel) selectedModel = JSON.parse(defaultSel) as SelectedModel;
  }
  const [defaltModel, setDefaltModel] = useState(selectedModel);
  const [currentModel, setCurrentModel] = useState(selectedModel);

  const setModalAsDefault = (model: SelectedModel) => {
    setDefaltModel({ name: model.name, model: model.model });
    if (typeof window != "undefined") {
      window.localStorage.setItem(
        "selectedModel",
        JSON.stringify({ name: model.name, model: model.model }),
      );
    }
  };

  useEffect(() => {
    setCThread(thread || null);

    return () => {};
  }, [thread]);

  useEffect(() => {
    if (isNewChat) {
      const newId = uuid();
      setTempId(newId);
      setCThread(null);
    }

    return () => {};
  }, [isNewChat]);

  const submitHandler = () => {
    if (isSignedIn && isNewChat) {
      window.history.pushState({}, "", "/chat/" + tempId);
    }

    chatprops.handleSubmit(
      {},
      {
        body: {
          model: currentModel.model,
          threadId: tempId,
          userInfo: {
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        },
      },
    );
  };

  return (
    <Chat.Provider
      value={{
        ...chatprops,
        currentModel,
        setCurrentModel,
        submitHandler,
        setIsNewChat,
        defaltModel,
        setModalAsDefault,
      }}
    >
      {children}
    </Chat.Provider>
  );
};

export default ChatContext;
