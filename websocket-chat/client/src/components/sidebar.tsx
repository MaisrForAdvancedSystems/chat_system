import { SideBar } from "react-chat-elements";

import { IChatItem } from "../types";
import { ChatItem } from "./chat-item";
import { useChat } from "../containers/chat-container";

export const ChatSidebar = ({
  onItemClick,
}: {
  onItemClick?: (itm: IChatItem) => void;
}) => {
  const {chatList} =useChat();
  const lst = chatList.map((itm, idx) => {
    return <ChatItem onClick={onItemClick} key={idx} item={itm} />;
  });
  return (
    <div className="chat-list">
      <SideBar top={<div>{lst}</div>} center={<></>} bottom={<span></span>} />
    </div>
  );
};
