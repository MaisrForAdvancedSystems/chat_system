/*export enum WsMessageType2 {
  CHAT = 0,
  INFO = 1,
  CONTROL = 2,
  CONNECTED_CLIENTS = 3,
  LOGIN=4,
  ERROR=5,
  WARNING=6
}*/
export const CHAT_MESSAGE = "chat";
export const INFO_MESSAGE = "info";
export const CONTROL_MESSAGE = "control";
export const CLIENTS_LIST_MESSAGE = "clients_list";
export const LOGIN_MESSAGE = "login";
export const LOGIN_SUCCSSED = "login_succssed";
export const LOGIN_FAILED = "login_failed";
export const ERROR_MESSAGE = "error";
export const WARNING_MESSAGE = "warning";
export const GPS_LOCATION = "gps_location";
export const SYSTEM_MESSAGE = "system";
export const APPLICATION_MESSAGE = "application";

export type WsMessageType =
  | "chat"
  | "info"
  | "control"
  | "clients_list"
  | "login"
  | "login_succssed"
  | "login_failed"
  | "error"
  | "warning"
  | "system"
  | "gps_location"
  | "application";

export interface ConnectedClient {
  id: number;
  name: string;
  device?: string;
  join_date?: Date;
  iam: boolean;
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
  my_id?: number;
}
export type messageFun = (m: WsMessage) => void;

export type WebsocketsContextState = {
  sendMessage?: messageFun;
  stateDescription?: string;
  stateIcon?: any;
  stateId?: number;
  conn?: WebSocket;
  registerOnMessageRecived?: (fnc: messageFun | null) => void;
  clients: Array<ConnectedClient>;
  addEventListener?: (
    typ: keyof WebSocketEventMap,
    fun: (ev: CloseEvent | Event | MessageEvent<any>) => void
  ) => void;
  removeEventListener?: (
    typ: keyof WebSocketEventMap,
    fun: (ev: CloseEvent | Event | MessageEvent<any>) => void
  ) => void;
};
