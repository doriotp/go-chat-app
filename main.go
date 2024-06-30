package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/chat-app/ws"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {

	if os.Getenv("env")!="production"{
		err:= godotenv.Load(".env")
		if err!=nil{
			log.Printf("error:%s", err) 
			return 
		}
	}
	hub := ws.NewHub()
	wsHandler := ws.NewHandler(hub)
	r := gin.Default()

	// WebSocket endpoints
	r.POST("/ws/createRoom", wsHandler.CreateRoom)
	r.GET("/ws/joinRoom/:roomId", wsHandler.JoinRoom)
	r.GET("/ws/getRooms", wsHandler.GetRooms)
	r.GET("/ws/getClients/:roomId", wsHandler.GetClients)

	// Serve static files
	r.LoadHTMLFiles("./createroom.html", "./join-room.html")
	r.Static("/static", "./static") // Replace with your static assets directory

	// Route handlers to render HTML files
	r.GET("/createroom", func(c *gin.Context) {
		c.HTML(http.StatusOK, "createroom.html", nil)
	})

	r.GET("/joinroom/*any", func(c *gin.Context) {
		c.HTML(http.StatusOK, "join-room.html", nil)
	})

	r.GET("/", func(c *gin.Context) {
		// Redirect to create room page or serve a main HTML file
		c.Redirect(http.StatusFound, "/createroom")
	})

	go hub.Run()

	port:= os.Getenv("PORT")
	if port==""{
		port="8080"
	}

	// Start server
	err := http.ListenAndServe(fmt.Sprintf(":%s", port), r)
	if err != nil {
		log.Printf("error:%s", err)
		return 
	}
}
