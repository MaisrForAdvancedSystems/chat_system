package main

import (
	"chat_server/chat"
	"log"
	"net/http"
)

func main() {
	log.SetFlags(log.Lshortfile)
	// websocket server
	server := chat.NewServer("/chat")
	go server.Listen()

	// static files
	http.Handle("/", http.FileServer(http.Dir("webroot")))

	log.Fatal(http.ListenAndServe(":8080", nil))
}
