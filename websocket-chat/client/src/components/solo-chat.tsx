import { IChatItem, Message } from "../types";
import { useEffect, useState } from "react";
import {
  Modal,
  Card,
  Button,
  CardHeader,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { FaPlusCircle } from "react-icons/fa";
import { ChatInput } from "./input";
import { MessageList } from "react-chat-elements";

export interface ChatItemProps {
  item?: IChatItem | undefined;
  data?: Array<Message>;
  onClose?: (itm: IChatItem | undefined) => void;
}

export const SoloChat = ({ item, data, onClose }: ChatItemProps) => {
  const [open, setOpen] = useState(!!item);
  useEffect(() => {
    setOpen(!!item);
  }, [item]);
  const handleClose = () => {
    console.log("closings");
    setOpen(false);
    if (onClose) {
      onClose(item);
    }
  };
  return (
    <Modal open={open}>
      <div>
        <Card title={"dsfsdfsdf"}>
          <CardContent>
            {item?.id}
            <CardActions>
              <Button onClick={handleClose}>
                <FaPlusCircle />
                اغلاق
              </Button>
            </CardActions>
          </CardContent>
        </Card>
        <div
          className="right-panel"
          style={{ background: "red", padding: 10, height: "500px" }}
        >
          <MessageList
            className="message-list"
            lockable={false}
            downButtonBadge={10}
            dataSource={
              data || [{ text: "123123123" }, { text: "lkgjfdlgjdflgj" }]
            }
          />
        </div>
        <ChatInput to={item?.id} />
      </div>
    </Modal>
  );
};
