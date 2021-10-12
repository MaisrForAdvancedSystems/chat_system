import React, { useCallback, useContext, useMemo, useState } from "react";
import { createContext } from "react";
import { IChatItem, Message } from "../../types";
import { useWebsockets } from "../websocket";

type Props = {};

type ChatContextState = {
  messageList: Array<Message>;
  chatList: Array<IChatItem>;
  addMessage?: (m: Message) => void;
};

const inital: ChatContextState = {
  messageList: [],
  chatList: [],
};

const ChatContext = createContext<ChatContextState>(inital);

export const ChatProvider: React.FC<Props> = ({ children }) => {
  const [state, setstate] = useState<ChatContextState>(inital);
  const { clients } = useWebsockets();
  const chatList = useMemo(() => {
    const lst: Array<IChatItem> = (clients || []).map<IChatItem>((a) => {
      let now = new Date().getTime();
      let join = new Date(a.join_date || "").getTime();
      return {
        id: a.id,
        text: a.name,
        title: a.iam ? "Iam" : a.name || a.id?.toString(),
        iam: a.iam,
        titleColor: "red",
        subTitle: "24234324",
      };
    });
    return lst;
  }, [clients]);

  const updateState = (nwState: Partial<ChatContextState>) => {
    setstate((prevState) => {
      return { ...prevState, ...nwState };
    });
  };

  const addMessage = useCallback(
    (m: Message) => {
      state.messageList.push(m);
      console.log({ m, messageList: state.messageList });
      updateState({ ...state });
    },
    [state.messageList]
  );

  const memo = useMemo(() => {
    return { ...state, addMessage,chatList };
  }, [state, addMessage,chatList]);
  return <ChatContext.Provider value={memo}>{children}</ChatContext.Provider>;
};

export const useChat = () => useContext(ChatContext);
