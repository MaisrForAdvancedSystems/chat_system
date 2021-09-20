import { Url } from "url";

export interface Message {
  id?: string;
  position?: "left" | "right";
  type?: "text" | "photo" | "file" | "location" | "spotify" | "video" | "audio";
  text?:string,
  title?:string,
  titleColor?:string,
  data?:any,
  date?:Date,
  dateString?:string,
  forwarded?:boolean,
  replyButton?:boolean,
  removeButton?:boolean,
  status?:'waiting'|'sent'|'received'|'read',
  notch?:boolean,
  avatar?:string|Url,
  copiableDate?:boolean,
  focus?:boolean,
  retracted?:boolean
}
