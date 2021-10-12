import { useEffect } from "react";
import { AuthContainer } from "../auth";
import { ChatProvider } from "../chat-container";
import { LeafletContainer } from "../leaflet";
import { WebsocketsProvider } from "../websocket";

type Props = {};

export const ApplicationProvider: React.FC<Props> = ({ children }) => {
  useEffect(() => {
    console.log("mount application provider");
    return () => {
      console.log("unmount application provider");
    };
  }, []);
  return (
    <LeafletContainer>
      <WebsocketsProvider>
        <AuthContainer>
          <ChatProvider>{children}</ChatProvider>
        </AuthContainer>
      </WebsocketsProvider>
    </LeafletContainer>
  );
};
