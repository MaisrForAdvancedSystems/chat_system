package chat

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"golang.org/x/net/websocket"
)

// Chat server.
type Server struct {
	pattern   string
	messages  []*Message
	clients   map[int64]*Client
	addCh     chan *Client
	delCh     chan *Client
	sendAllCh chan *Message
	doneCh    chan bool
	errCh     chan error
}

// Create new chat server.
func NewServer(pattern string) *Server {
	messages := []*Message{}
	clients := make(map[int64]*Client)
	addCh := make(chan *Client)
	delCh := make(chan *Client)
	sendAllCh := make(chan *Message)
	doneCh := make(chan bool)
	errCh := make(chan error)
	return &Server{
		pattern,
		messages,
		clients,
		addCh,
		delCh,
		sendAllCh,
		doneCh,
		errCh,
	}
}

func (s *Server) Add(c *Client) {
	s.addCh <- c
}

func (s *Server) Del(c *Client) {
	s.delCh <- c
}

func (s *Server) SendAll(msg *Message) {
	s.sendAllCh <- msg
}

func (s *Server) SendMessage(sender *Client, msg *Message) {
	if msg == nil {
		return
	}
	if msg.To == 0 {
		s.sendAllCh <- msg
	} else {
		client, ok := s.clients[msg.To]
		if ok {
			if client.id != sender.id {
				client.Write(msg)
			}
		} else {
			s.Err(errors.New(fmt.Sprintf("Client not found %v", msg.Id)))
		}
	}
}

func (s *Server) Done() {
	s.doneCh <- true
}

func (s *Server) Err(err error) {
	s.errCh <- err
}

func (s *Server) sendPastMessages(c *Client) {
	cnt := 100
	for i := 0; i < 5 && i < len(s.messages); i++ {
		ptr := len(s.messages) - cnt + i
		if ptr >= 0 && ptr < len(s.messages) {
			msg := s.messages[ptr]
			c.Write(msg)
		}
	}
}

func (s *Server) sendConnectedClients(c *Client) {
	msg := Message{}
	msg.Id = time.Now().Unix()
	msg.MessageType = CONNECTED_CLIENTS
	connected := make([]*ConntectdClient, 0)
	for _, cl := range s.clients {
		con := &ConntectdClient{
			Id:       cl.id,
			Name:     cl.name,
			JoinDate: cl.joinDate,
		}
		if cl.id == c.id {
			con.Iam = true
		}
		connected = append(connected, con)
	}
	msg.Clients = connected
	c.Write(&msg)
}

func (s *Server) sendAllConnectedClients() {
	for _, c := range s.clients {
		s.sendConnectedClients(c)
	}
}

func (s *Server) sendAll(msg *Message) {
	for _, c := range s.clients {
		if c.id == msg.From {
			continue
		}
		c.Write(msg)
	}
}

// Listen and serve.
// It serves client connection and broadcast request.
func (s *Server) Listen() {

	log.Println("Listening server...")

	// websocket handler
	onConnected := func(ws *websocket.Conn, device string) {
		defer func() {
			err := ws.Close()
			if err != nil {
				s.errCh <- err
			}
		}()

		client := NewClient(ws, s, device)
		s.Add(client)
		client.Listen()
	}
	http.Handle(s.pattern, http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
		device := "desktop"
		if strings.Contains(strings.ToLower(r.Header.Get("User-Agent")), "mobi") {
			device = "mobile"
		}
		websocket.Handler(func(c *websocket.Conn) {
			onConnected(c, device)
		}).ServeHTTP(rw, r)
	}))
	log.Println("Created handler")

	for {
		select {
		// Add new a client
		case c := <-s.addCh:
			log.Println("Added new client")
			s.clients[c.id] = c
			log.Println("Now", len(s.clients), "clients connected.")
			//s.sendAllConnectedClients()
			//s.sendPastMessages(c)
			err := saveNewSession(c)
			if err != nil {
				s.Err(err)
			}

		// del a client
		case c := <-s.delCh:
			log.Println("Delete client")
			delete(s.clients, c.id)
			s.sendAllConnectedClients()
			err := saveSessionLeft(c)
			if err != nil {
				s.Err(err)
			}
		// broadcast message for all clients
		case msg := <-s.sendAllCh:
			log.Println("Send all:", msg)
			s.messages = append(s.messages, msg)
			s.sendAll(msg)
		case err := <-s.errCh:
			log.Println("Error:", err.Error())

		case <-s.doneCh:
			return
		}
	}
}
