import {
    ReactElement,
  } from "react";
  import {
    BiError,
  } from "react-icons/all";
export const getWebsocketState = (
    state?: number
  ): { describtion: string; color: string; icon?: ReactElement } => {
    if (state == WebSocket.OPEN) {
      let icon = <BiError />;
      return { describtion: "متصل", color: "green", icon };
    }
    if (state == WebSocket.CONNECTING) {
      return { describtion: "جاري الاتصال", color: "orange" };
    }
    if (state == WebSocket.CLOSING) {
      return { describtion: "جاري انهاء الجلسة", color: "orange" };
    }
    return { describtion: "غير متصل", color: "red" };
  };