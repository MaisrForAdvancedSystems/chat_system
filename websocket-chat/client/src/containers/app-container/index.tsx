import { ChatProvider } from "../chat-container";
import { LeafletContainer } from "../leaflet";
import { WebsocketsProvider } from "../websocket";

type Props = {};

export const ApplicationProvider: React.FC<Props> = ({ children }) => {
  return (
    <LeafletContainer>
      <ChatProvider>
        <WebsocketsProvider>{children}</WebsocketsProvider>
      </ChatProvider>
    </LeafletContainer>
  );
};
