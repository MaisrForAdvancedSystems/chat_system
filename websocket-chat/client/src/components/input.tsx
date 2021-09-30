import { useState } from "react";
import { Button } from "react-chat-elements";
import { useChat } from "../containers/chat-container";
import { useWebsockets } from "../containers/websocket";
import { WsMessageType } from "../containers/websocket/types";
export const ChatInput = () => {
  const { addMessage } = useChat();
  const { sendMessage } = useWebsockets();
  const [text, setText] = useState<string>();
  const addNewMessage = () => {
    console.log({ text });
    if (!text) {
      return;
    }
    if (addMessage && sendMessage) {
      addMessage({
        text,
        data: text,
        date: new Date(),
        id: Date.now(),
        status: "read",
        removeButton: true,
        replyButton: true,
        position: "left",
      });
      sendMessage({
        id: 0,
        message_type: WsMessageType.CHAT,
        content: text,
        content_type: "text",
      });
    } else {
      console.error("send message error:no method");
    }
    setText("");
  };
  return (
    <div style={{ display: "flex", padding: 5 }}>
      <input
        placeholder="اكتب رسالة"
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
      <Button text="send" onClick={addNewMessage} />
    </div>
  );
};
