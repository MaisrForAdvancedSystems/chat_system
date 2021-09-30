package chat

import (
	"fmt"
	"time"
)

type MessageType int

const CHAT MessageType = 0
const INFO MessageType = 1
const CONTROL MessageType = 2
const CONNECTED_CLIENTS MessageType = 3

type Device int64

type ConntectdClient struct {
	Id       int64     `json:"id"`
	Name     string    `json:"name"`
	JoinDate time.Time `json:"join_date"`
	Device   string    `json:"device"`
	Iam      bool      `json:"iam"`
}

type ControlMessage struct {
}

type Message struct {
	Id          int64              `json:"id"`
	MessageType MessageType        `json:"message_type"`
	ContentType string             `json:"content_type"`
	From        int64              `json:"from"`
	To          int64              `json:"to"`
	Content     string             `json:"content"`
	Date        *time.Time         `json:"date"`
	User        string             `json:"user"`
	Source      string             `json:"source"`
	Clients     []*ConntectdClient `json:"clients"`
	MyId        int64              `json:"my_id"`
}

func (self *Message) String() string {
	return fmt.Sprintf("%v", self.Id)
}

func (self *Message) SaveToDatabase() error {
	return saveMessage(self)
}
