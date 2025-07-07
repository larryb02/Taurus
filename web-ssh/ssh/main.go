package main

import (
	"log"
	"time"
	"os"
	"golang.org/x/crypto/ssh"
)

func main() {
	logger := log.Default()
	config := &ssh.ClientConfig{
		User: "dummy",
		Auth: []ssh.AuthMethod{
			ssh.Password("password"),
		},
		HostKeyCallback: ssh.InsecureIgnoreHostKey(),
		Timeout:         time.Hour,
	}
	client, err := ssh.Dial("tcp", "localhost:2222", config)
	if err != nil {
		logger.Fatal("Failed to create ssh client: ", err)
	}
	defer client.Close()
	logger.Printf("Created ssh client")
	session, err := client.NewSession()
	if err != nil {
		logger.Fatal("Failed to create ssh session: ", err)
	}
	logger.Printf("Created ssh session")
	defer session.Close()
	modes := ssh.TerminalModes{
		ssh.ECHO:          1,     // disable echoing
		ssh.TTY_OP_ISPEED: 14400, // input speed = 14.4kbaud
		ssh.TTY_OP_OSPEED: 14400, // output speed = 14.4kbaud
	}
	if err := session.RequestPty("xterm", 40, 80, modes); err != nil {
		logger.Fatal("Failed to request pty for session: ", err)
	}
	logger.Printf("Successfully established Pty")
	// input, err := session.StdinPipe()
	// if err != nil {
	// 	logger.Fatal("Failed to create Stdin pipe: ", err)
	// }
	session.Stdout = os.Stdout
	session.Stdin = os.Stdin
	session.Stderr = os.Stderr
	if err := session.Shell(); err != nil {
		log.Fatal("failed to start shell: ", err)
	}

	err = session.Wait()
	if err != nil {
		log.Fatal("Failed to run: ", err.Error())
	}
	// for {
		
	// }

}
