import { useMemo, useState } from "react";
import { ChatList, SideBar } from "react-chat-elements";

import { useWebsockets } from "../containers/websocket";
import { IChatItem } from "../types";
import { BiDevices } from "react-icons/all";
import { ChatItem } from "./chat-item";

export const ChatSidebar = ({}: {}) => {
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
  const lst = chatList.map((itm,idx) => {
    return <ChatItem key={idx} item={itm} />;
  });
  return (
    <div className="chat-list">
      <SideBar top={<div>{lst}</div>} center={<></>} bottom={<span></span>} />
    </div>
  );
};
