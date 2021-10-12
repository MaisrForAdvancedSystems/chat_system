package chat

import (
	"fmt"
	"time"
)

type MessageType string

const CHAT MessageType = "chat"
const INFO MessageType = "info"
const CONTROL MessageType = "control"
const CONNECTED_CLIENTS MessageType = "clients_list"
const LOGIN MessageType = "login"
const LOGIN_SUCCSSED MessageType = "login_succssed"
const LOGIN_FAILED MessageType = "login_failed"
const ERROR MessageType = "error"
const WARNING MessageType = "warning"
const SYSTEM_MESSAGE MessageType = "system"
const GPS_LOCATION MessageType = "gps_location"
const APPLICATION MessageType = "application"

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
