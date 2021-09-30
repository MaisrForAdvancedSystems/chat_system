import React, { useCallback, useContext, useMemo, useState } from "react";
import { createContext } from "react";
import { IChatItem, Message } from "../../types";

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
    return { ...state, addMessage };
  }, [state, addMessage]);
  return <ChatContext.Provider value={memo}>{children}</ChatContext.Provider>;
};

export const useChat = () => useContext(ChatContext);
