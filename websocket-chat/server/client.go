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

	return &Client{id, "", ws, server, ch, doneCh, time.Now()}
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
				if msg.MessageType == INFO {
					c.name = msg.Content
					c.server.sendAllConnectedClients()
					saveSessionName(c)
				} else {
					msg.From = c.id
					c.server.SendMessage(c, &msg)
				}
			}
		}
	}
}
