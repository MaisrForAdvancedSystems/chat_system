import { useCallback, useEffect, useState } from "react";

import { useWebsockets } from "./containers/websocket";
import { useChat } from "./containers/chat-container";
import { LOGIN_SUCCSSED, WsMessage } from "./containers/websocket/types";
import { ChatSidebar } from "./components/sidebar";
import { IChatItem, Message } from "./types";
import { MessageList,MessageBox } from "react-chat-elements";
import { ChatInput } from "./components/input";
import { MapContainer, TileLayer, Marker, Popup } from "./react-leaflet";
import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
} from "@mui/material";
import { FiMap, FiAnchor, FiMaximize } from "react-icons/fi";
import { useLeafletContext } from "./react-leaflet/core";
import { SoloChat } from "./components/solo-chat";

export const App = () => {
  const { registerOnMessageRecived } = useWebsockets();
  const { addMessage, messageList,chatList} = useChat();
  const [currentClient, setCurrentClient] = useState<IChatItem | undefined>();
  const [showMap, setShowMap] = useState<boolean>(false);
  const [hideMessageList, setHideMessagList] = useState<boolean>(false);
  const { goToMylocation } = useLeafletContext();

  useEffect(() => {
    if(!currentClient){
      console.log("set current client");
      let crnt=chatList.filter(a=>a.iam)[0];
      console.log({crnt});
      if(crnt){
        setCurrentClient(crnt);
      }else{
        console.log(chatList);
      }
    }
  },[chatList,currentClient])
  const handMessage = useCallback(
    (ws: WsMessage) => {
      if (addMessage && ws) {
        addMessage({
          id: ws.id,
          text: ws.content,
          position: ws.from == ws.my_id ? "left" : "right",
          title: ws.from?.toString(),
          date: ws.date,
          wsMessage: ws,
        });
      } else {
        console.log("skiping");
        console.dir({ addMessage, ws });
      }
    },
    [addMessage]
  );
  useEffect(() => {
    if (registerOnMessageRecived) {
      registerOnMessageRecived(handMessage);
    }
    return () => {
      if (registerOnMessageRecived) {
        registerOnMessageRecived(null);
      }
    };
  }, [registerOnMessageRecived]);

  let filteredMessageList:Array<Message> = [];
  if (currentClient) {
    let id = currentClient.id;
    if(currentClient.iam){
      filteredMessageList=messageList
    }else{
      filteredMessageList = messageList.filter((a) => {
        console.log(id, a.wsMessage?.from, a.wsMessage?.to);
        return (
          (a.wsMessage?.from == id) || (a.wsMessage?.to == id)
        );
      });
    }    
  }
  const onItemClick = useCallback(
    (itm: IChatItem) => {
      setCurrentClient(itm);
    },
    [setCurrentClient]
  );
  return (
    <div className="container">
      <ChatSidebar onItemClick={onItemClick} />
      <div className="right-panel">
        <Card>
          <CardContent>{currentClient?.iam?"رسائل جماعية":currentClient?.id}</CardContent>
        </Card>
        {false && (
          <MessageList
            className="message-list"
            lockable={true}
            downButtonBadge={10}
            dataSource={messageList}
          />
        )}
          <div className="message-list">
            {
              filteredMessageList.map((a,idx)=>{
                return <MessageBox key={idx} {...a}></MessageBox>
              })
            }
          </div>
        
        <div style={{ textAlign: "center" }}>
          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
          >
            {!hideMessageList && (
              <Button
                onClick={() => {
                  setShowMap(!showMap);
                }}
                title={showMap ? "اخفاء الخريطة" : "اظهار الخريطة"}
              >
                <FiMap />
              </Button>
            )}
            {showMap && (
              <Button title="مكاني">
                <FiAnchor onClick={goToMylocation} />
              </Button>
            )}
            {showMap && (
              <Button
                title={hideMessageList ? "تصغير" : "تكبير"}
                onClick={() => {
                  setShowMap(false);
                  setTimeout(() => {
                    setHideMessagList(!hideMessageList);
                    setTimeout(() => {
                      setShowMap(true);
                    }, 10);
                  }, 10);
                }}
              >
                <FiMaximize />
              </Button>
            )}
          </ButtonGroup>
        </div>
        {showMap && (
          <div className="message-list">
            <MapContainer
              style={{ zIndex: 10000, width: "100%", height: "100%" }}
              center={[51.505, -0.09]}
              zoom={13}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[51.505, -0.09]}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        )}
        {currentClient && <ChatInput all={currentClient.iam} to={currentClient?.id} />}
      </div>
      {false && (
        <SoloChat
          item={currentClient}
          data={filteredMessageList}
          onClose={() => {
            setCurrentClient(undefined);
          }}
        />
      )}
    </div>
  );
};

export default App;
