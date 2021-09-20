import { WebsocketsProvider } from "./websocket";

type Props = {};

export const ApplicationProvider: React.FC<Props> = ({ children }) => {
  return <WebsocketsProvider>{children}</WebsocketsProvider>;
};
