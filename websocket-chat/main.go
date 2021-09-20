package main

import (
	chat "chat_server/server"
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
