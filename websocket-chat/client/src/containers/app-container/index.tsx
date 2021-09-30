import { ChatProvider } from "../chat-container";
import { WebsocketsProvider } from "../websocket";

type Props = {};

export const ApplicationProvider: React.FC<Props> = ({ children }) => { 
  return (
    <ChatProvider>
      <WebsocketsProvider>
        {children}
      </WebsocketsProvider>
    </ChatProvider>
  );
};
