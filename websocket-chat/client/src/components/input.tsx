import { useState } from "react";
import { Button } from "react-chat-elements";
import { useChat } from "../containers/chat-container";
import { useWebsockets } from "../containers/websocket";
import { CHAT_MESSAGE, WsMessage, WsMessageType } from "../containers/websocket/types";

export const ChatInput = ({to,all}:{to?:number,all?:boolean}) => {
  const { addMessage } = useChat();
  const { sendMessage } = useWebsockets();
  const [text, setText] = useState<string>();
  const addNewMessage = () => {
    if (!text) {
      return;
    }
    if (addMessage && sendMessage) {
      let wsMesage:WsMessage={
        id: 0,
        message_type: CHAT_MESSAGE,
        content: text,
        content_type: "text",
        to:all?undefined:to
      }
      addMessage({
        text,
        data: text,
        date: new Date(),
        id: Date.now(),
        status: "read",
        removeButton: true,
        replyButton: true,
        position: "left",
        wsMessage:wsMesage
      });
      sendMessage(wsMesage);
    } else {
      console.error("send message error:no method");
    }
    setText("");
  };
  return (
    <div style={{ display: "flex", padding: 5 }}>
      <input
        placeholder={all?"ارسل رسالة الى الجميع":"ارسل رسالة"}
        value={text || ""}
        onChange={(evt) => {
          setText(evt.target.value);
        }}
        style={{ flexGrow: 2 }}
        onKeyPress={(e: any) => {
          if (e.shiftKey && e.charCode === 13) {
            return true;
          }
          if (e.charCode === 13) {
            //this.refs.input.clear();
            addNewMessage();
            e.preventDefault();
            return false;
          }
        }}
      />
      <Button text={all?"رسالة جماعية":"رسالة"} onClick={addNewMessage} />
    </div>
  );
};
