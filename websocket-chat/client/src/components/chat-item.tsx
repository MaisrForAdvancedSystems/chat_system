import { ChatItem as ChatItemElm } from "react-chat-elements";

import { IChatItem } from "../types";
import { BiDevices, GiFireBreath } from "react-icons/all";
import { useCallback } from "react";
import { FiActivity } from "react-icons/all";
import { useMap } from "../react-leaflet";
import { LatLng } from "leaflet";

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
  const map=useMap();
  const goToMylocation=()=>{
    if(map){
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((p)=>{
          let lc:LatLng=new LatLng(p.coords.latitude,p.coords.longitude,p.coords.accuracy);
          map.flyTo(lc,18,{})
        });
      }
    }
  }
  return (
    <div>
      <ChatItemElm
        avatar={""}
        alt={item.id}
        title={item.title}
        subtitle={item.id}
        date={new Date()}
        unread={0}
        icon={BiDevices}
        onClick={handleClick}
      />
      <div>
        <button title="الموقع">
          <GiFireBreath onClick={()=>{map?.setZoom(30)}} color="red" />
        </button>
        <button title="اغلاق مسار قراءة">
          <FiActivity onClick={goToMylocation} color="red" />
        </button>
      </div>
      <div>--------------</div>
    </div>
  );
};
