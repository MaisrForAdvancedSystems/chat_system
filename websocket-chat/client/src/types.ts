import { Url } from "url";
import { WsMessage } from "./containers/websocket/types";


export interface IChatItem {
  id: number;
  position?: "left" | "right";
  type?: string;
  text?: string;
  title?: string;
  titleColor?: string;  
  iam:boolean,
  subTitle?:string,
  date?: Date;
  dateString?: string;
}



export interface Message {
  id: number;
  position?: "left" | "right";
  type?: "text" | "photo" | "file" | "location" | "spotify" | "video" | "audio";
  text?: string;
  title?: string;
  titleColor?: string;
  data?: any;
  date?: Date;
  dateString?: string;
  forwarded?: boolean;
  replyButton?: boolean;
  removeButton?: boolean;
  status?: "waiting" | "sent" | "received" | "read";
  notch?: boolean;
  avatar?: string | Url;
  copiableDate?: boolean;
  focus?: boolean;
  retracted?: boolean;
  wsMessage?:WsMessage
}
