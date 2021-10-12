package chat

import (
	"fmt"
	"io"
	"log"
	"time"

	"golang.org/x/net/websocket"
)

const channelBufSize = 100

var maxId int = 0

// Chat client.
type Client struct {
	id       int64
	name     string
	ws       *websocket.Conn
	server   *Server
	ch       chan *Message
	doneCh   chan bool
	joinDate time.Time
	isLoged  bool
	token    *string
}

func (c *Client) IsLoged() bool {
	return c.isLoged
}

// Create new chat client.
func NewClient(ws *websocket.Conn, server *Server, device string) *Client {

	if ws == nil {
		panic("ws cannot be nil")
	}

	if server == nil {
		panic("server cannot be nil")
	}

	id := time.Now().Unix()
	ch := make(chan *Message, channelBufSize)
	doneCh := make(chan bool)

	return &Client{id, "", ws, server, ch, doneCh, time.Now(), false, nil}
}

func (c *Client) Conn() *websocket.Conn {
	return c.ws
}

func (c *Client) Write(msg *Message) {
	select {
	case c.ch <- msg:
	default:
		c.server.Del(c)
		err := fmt.Errorf("client %d is disconnected.", c.id)
		c.server.Err(err)
	}
}

func (c *Client) Done() {
	c.doneCh <- true
}

// Listen Write and Read request via chanel
func (c *Client) Listen() {
	go c.listenWrite()
	c.listenRead()
}

// Listen write request via chanel
func (c *Client) listenWrite() {
	log.Println("Listening write to client")
	for {
		select {
		// send message to the client
		case msg := <-c.ch:
			if msg != nil {
				m := *msg
				m.MyId = c.id
				websocket.JSON.Send(c.ws, &m)
			}
		// receive done request
		case <-c.doneCh:
			c.server.Del(c)
			c.doneCh <- true // for listenRead method
			return
		}
	}
}

// Listen read request via chanel
func (c *Client) listenRead() {
	log.Println("Listening read from client")
	for {
		select {

		// receive done request
		case <-c.doneCh:
			c.server.Del(c)
			c.doneCh <- true // for listenWrite method
			return

		// read data from websocket connection
		default:
			var msg Message
			err := websocket.JSON.Receive(c.ws, &msg)
			if err == io.EOF {
				c.doneCh <- true
			} else if err != nil {
				c.server.Err(err)
			} else {
				log.Println(msg.MessageType)
				if msg.MessageType == LOGIN {
					user, isLogid, err := login(&msg)
					if err != nil || user == nil {
						c.Write(&Message{
							Id:          time.Now().Unix(),
							MessageType: LOGIN_FAILED,
							Content:     err.Error(),
							ContentType: "string",
						})
						continue
					}
					if isLogid {
						c.Write(&Message{
							Id:          time.Now().Unix(),
							MessageType: LOGIN_SUCCSSED,
							Content:     "login succssed",
							ContentType: "string",
						})
						c.name = user.Name
						c.isLoged = isLogid
						c.token = &user.Token
						time.Sleep(10 * time.Millisecond)
						c.server.sendAllConnectedClients()
						c.server.sendPastMessages(c)
						saveSessionName(c)
					} else {
						c.Write(&Message{
							Id:          time.Now().Unix(),
							MessageType: LOGIN_FAILED,
							Content:     "بيانات الدخول غير صحيحة",
							ContentType: "string",
						})
					}

				} else {
					msg.From = c.id
					c.server.SendMessage(c, &msg)
				}
			}
		}
	}
}
