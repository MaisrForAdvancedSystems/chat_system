import React, {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createContext } from "react";
import { Message } from "./types";
import { ImConnection,FcBrokenLink,CgDanger,BiErrorCircle, BiError } from "react-icons/all";

type Props = {};
type messageFun = (m: Message) => void;

type WebsocketsContextState = {
  messageList: Array<Message>;
  chatList: Array<Message>;
  //addMessage?: messageFun;
  sendMessage?: messageFun;
};

const inital: WebsocketsContextState = {
  messageList: [],
  chatList: [],
};

const getWebsocketState = (
  state?: number
): { describtion: string; color: string,icon?:ReactElement } => {
  if (state == WebSocket.OPEN) {
    let icon=<BiError/>
    return { describtion: "متصل", color: "green",icon };
  }
  if (state == WebSocket.CONNECTING) {
    return { describtion: "جاري الاتصال", color: "orange" };
  }
  if (state == WebSocket.CLOSING) {
    return { describtion: "جاري انهاء الجلسة", color: "orange" };
  }
  return { describtion: "غير متصل", color: "red" };
};

const WebsocketsContext = createContext<WebsocketsContextState>(inital);

export const WebsocketsProvider: React.FC<Props> = ({ children }) => {
  const [state, setstate] = useState<WebsocketsContextState>(inital);
  const [conn, setConn] = useState<WebSocket>();
  const addr = "ws://localhost:8080/chat";
  useEffect(() => {
    let cn = new WebSocket(addr);
    setConn(cn);
    return () => {
      if (cn) {
        cn.close();
      }
    };
  }, []);
  useEffect(() => {
    if (conn) {
      conn.onopen = () => {
        conn.send(JSON.stringify({}));
      };
      conn.onmessage = (ev) => {
        onMessageReceived(ev);
      };
      conn.onerror = (ev) => {
        conn.close();
        updateState({});
      };
      conn.onclose = (cEvt) => {
        updateState({});
        console.log("connection closed");
        console.dir(cEvt);
        setTimeout(() => {
          let cn = new WebSocket(addr);
          setConn(cn);
        }, 1000);
      };
    }
  }, [conn]);
  const sendMessage = (m: Message) => {
    if (!conn) {
      return;
    }
    m.id = Math.random().toString();
    conn.send(JSON.stringify(m));
    m.position = "right";
    addMessage(m);
  };

  const updateState = (nwState: Partial<WebsocketsContextState>) => {
    setstate((prevState) => {
      return { ...prevState, ...nwState };
    });
  };

  const addMessage = (m: Message) => {
    state.messageList.push(m);
    console.log({ m, messageList: state.messageList });
    updateState({ ...state });
  };

  const onMessageReceived = (s: MessageEvent<any>) => {
    console.log("message received");
    addMessage({ text: s.data });
  };
  const memo = useMemo(() => {
    return { ...state, addMessage, sendMessage };
  }, [state, conn, addMessage, sendMessage]);
  const stateDescription = getWebsocketState(conn?.readyState);
  return (
    <WebsocketsContext.Provider value={memo}>
      <>
        <div
          style={{
            position: "fixed",
            zIndex: 1111,
            background: stateDescription.color,
          }}
        >
          {conn?.readyState}-{stateDescription.describtion}
          <ImConnection />
          <FcBrokenLink/>
          <CgDanger/>
          <BiErrorCircle/>
        </div>
        {children}
      </>
    </WebsocketsContext.Provider>
  );
};

export const useWebsockets = () => useContext(WebsocketsContext);
