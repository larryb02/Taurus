package main

import (
	"log"
	// "golang.org/x/crypto/ssh"
	// "time"
	// "taurus/ssh/client"
	"taurus/ssh/web"
)

func main() {
	logger := log.Default()
	// var (
	// 	user = "dummy"
	// 	auth = []ssh.AuthMethod{
	// 		ssh.Password("password"),
	// 	}
	// 	host = "localhost"
	// 	port = "2222"

	// 	hostkeycb = ssh.InsecureIgnoreHostKey()
	// )
	// const (
	// 	protocol = "tcp"
	// 	ttl      = 30 * time.Minute
	// )
	// config := client.CreateConfig(user, auth, hostkeycb, ttl)
	// conn := client.CreateSshConnection(config, host, port)
	// cli, err := client.CreateClient(conn)
	// if err != nil {
	// 	logger.Fatal("Failed to create client: ", err)
	// }
	// pty := client.CreatePty(80, 40)
	// s, err := client.CreateSession(cli, pty)
	// if err != nil {
	// 	logger.Fatal("Failed to create ssh session: ", err)
	// }
	// if err := s.StartShell(); err != nil {
	// 	logger.Fatal("Failed to start shell: ", err)
	// }
	logger.Printf("Something")
	web.Start()
}
