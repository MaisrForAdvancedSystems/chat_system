export enum WsMessageType {
  CHAT = 0,
  INFO = 1,
  CONTROL = 2,
  CONNECTED_CLIENTS = 3,
}

export interface ConnectedClient {
  id: number;
  name: string;
  device?:string;
  join_date?:Date;
  iam:boolean
}

export interface WsMessage {
  id: number;
  message_type: WsMessageType;
  content_type?: string;
  content?: string;
  from?: number;
  to?: number;
  date?: Date;
  user?: string;
  source?: string;
  clients?: Array<ConnectedClient>;
  my_id?:number
}
export type messageFun = (m: WsMessage) => void;

export type WebsocketsContextState = {
  sendMessage?: messageFun;
  stateDescription?: string;
  stateIcon?: any;
  stateId?: number;
  conn?: WebSocket;
  registerOnMessageRecived?:(fnc:messageFun|null)=>void
  clients:Array<ConnectedClient>
};
