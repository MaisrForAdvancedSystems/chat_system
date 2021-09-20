import "./App.css";

import { useState } from "react";
import {
  ChatList,
  MessageList,
  Button,
  SideBar,
} from "react-chat-elements";

import { useWebsockets } from "./websocket";

export const App = () => {
  const { chatList, messageList,sendMessage } = useWebsockets();
  const [text, setText] = useState<string>();
  const addNewMessage = () => {
    console.log({text})
    if (!sendMessage || !text) {
      return;
    }
    sendMessage({ text, data: text, date: new Date(),id:'1',status:'read',removeButton:true,replyButton:true });
    setText("");
  };
  return (
    <div className="container">
      <div className="chat-list">
        <SideBar
          top={
            <ChatList
              dataSource={chatList}
              onClickMute={({ ...props }) => console.log(props)}
              onClickVideoCall={({ ...props }) => console.log(props)}
            />
          }
          center={<></>}
          bottom={<span></span>}
        />
      </div>
      <div className="right-panel">
        <MessageList
          className="message-list"
          lockable={true}
          downButtonBadge={10}
          dataSource={messageList}
        />
        <div style={{display:'flex',padding:5}}>
          <input
            placeholder="اكتب رسالة"
            value={text||''}
            onChange={(evt)=>{setText(evt.target.value)}}
            style={{flexGrow:2}}
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
      </div>
    </div>
  );
};

export default App;
