import { ChatItem as ChatItemElm } from "react-chat-elements";

import { IChatItem } from "../types";
import { BiDevices } from "react-icons/all";
import { useCallback } from "react";
import { FiActivity } from "react-icons/all";
import { useMap } from "../react-leaflet";

export interface ChatItemProps {
  item: IChatItem;
  onClick?: (itm: IChatItem) => void;
}

export const ChatItem = ({ item, onClick }: ChatItemProps) => {
  const handleClick = useCallback(() => {
    console.log("clieked " + item?.id);
    if (onClick) {
      onClick(item);
    }
  }, [item, onClick]);
  const {setZoom}=useMap();
  return (
    <div>
      <ChatItemElm
        avatar={""}
        alt={item.id}
        title={item.title}
        subtitle={item.subTitle}
        date={new Date()}
        unread={0}
        icon={BiDevices}
        onClick={handleClick}
      />
      <div>
        <button title="اغلاق مسار تحصيل">
          <FiActivity onClick={()=>{setZoom(1)}} color="red" />
        </button>
        <button title="اغلاق مسار قراءة">
          <FiActivity color="red" />
        </button>
      </div>
      <div>--------------</div>
    </div>
  );
};
