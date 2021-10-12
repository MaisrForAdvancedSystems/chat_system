package chat

import (
	"encoding/json"
	"errors"
	"log"
	"time"
)

type LoginData struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type User struct {
	Name     string `json:"name"`
	Id       int64  `json:"id"`
	Username string `json:"username"`
	Token    string `json:"token"`
}

func login(ws *Message) (*User, bool, error) {
	log.Println("handle login request")
	if ws == nil || ws.MessageType != LOGIN {
		return nil, false, errors.New("invalied login message")
	}
	logindata := LoginData{}
	err := json.Unmarshal([]byte(ws.Content), &logindata)
	if err != nil {
		return nil, false, err
	}
	return &User{Name: logindata.Username,
			Username: logindata.Username,
			Id:       time.Now().Unix(),
			Token:    logindata.Password},
		true, nil
}
