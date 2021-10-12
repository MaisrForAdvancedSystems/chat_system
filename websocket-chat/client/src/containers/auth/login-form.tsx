import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useWebsockets } from "../websocket";
import { LOGIN_FAILED, LOGIN_MESSAGE, LOGIN_SUCCSSED, WsMessage } from "../websocket/types";

export const LoginForm: React.FC<{
  onClick?: (username: string, password: string) => void;
  onLoginSuccsed?: () => void;
  onLoginFailed?: () => void;
}> = ({ onClick,onLoginSuccsed,onLoginFailed }) => {
  const [state, setState] = useState<{ username: string; password: string }>({
    username: "",
    password: "",
  });
  const { sendMessage, addEventListener, removeEventListener } =
    useWebsockets();
  const handleLoginMessageReceived=useCallback((m:MessageEvent<null>|CloseEvent|Event)=>{
    console.dir({loginMsg:m});
    const msg=m as MessageEvent;
    if(msg.data){
      try{
        const ws:WsMessage=JSON.parse(msg.data);
        if(ws.message_type==LOGIN_SUCCSSED){
          console.log(ws.content);
          if(onLoginSuccsed){
            onLoginSuccsed();
          }
        }
        if(ws.message_type==LOGIN_FAILED){
          if(onLoginFailed){
            onLoginFailed();
          }
        }
      }
      catch(err){
        console.error(err);
      }
    }
  },[])
  useEffect(()=>{
    if(addEventListener){
      addEventListener("message",handleLoginMessageReceived);
    }
    return ()=>{
      console.log("removing listener")
      if(removeEventListener)
        removeEventListener("message",handleLoginMessageReceived);
    }
  },[addEventListener,removeEventListener])
  const onChange = (field: string) => {
    return (evt: any) => {
      setState({ ...state, [field]: evt.target.value });
    };
  };
  const onLoginClick = () => {
    let ws:WsMessage={
      id:0,
      message_type:LOGIN_MESSAGE,
      content:JSON.stringify({username:state.username,password:state.password}),
      content_type:"json"      
    }
    if(sendMessage){
      sendMessage(ws);
    }
    if (onClick) {
      onClick(state.username, state.password);
    }
  };
  return (
    <Container sx={{ height: "100%" }}>
      <Card sx={{ marginTop: "15%", width: "70%", height: "50%" }}>
        <CardHeader>
          <Typography>تسجيل دخول</Typography>
        </CardHeader>
        <CardContent
          sx={{
            flexDirection: "column",
            padding: 10,
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography>تسجيل دخول</Typography>
          <FormControl>
            <InputLabel htmlFor="username-input">username</InputLabel>
            <Input
              value={state.username}
              onChange={onChange("username")}
              id="username-input"
              aria-describedby="my-helper-text"
            />
            <FormHelperText id="my-helper-text"></FormHelperText>
          </FormControl>
          <Divider />
          <FormControl>
            <InputLabel htmlFor="password-input">password</InputLabel>
            <Input
              value={state.password}
              onChange={onChange("password")}
              id="password-input"
              aria-describedby="my-helper-text"
            />
            <FormHelperText id="my-helper-text"></FormHelperText>
          </FormControl>
          <Button onClick={onLoginClick}>login</Button>
        </CardContent>
      </Card>
    </Container>
  );
};
