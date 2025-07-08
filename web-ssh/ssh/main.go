package main

import (
	"golang.org/x/crypto/ssh"
	"log"
	"os"
	"time"
)

func CreateConfig(user string, auth []ssh.AuthMethod, hostkeycb ssh.HostKeyCallback, ttl time.Duration) *ssh.ClientConfig {
	return &ssh.ClientConfig{
		User:            user,
		Auth:            auth,
		HostKeyCallback: hostkeycb,
		Timeout:         ttl,
	}
}

// data that will be used to configure an ssh client
type SshConnection struct {
	config *ssh.ClientConfig
	host   string
	port   string
}

func CreateClient(conn *SshConnection) (*ssh.Client, error) {
	const protocol = "tcp"
	addr := conn.host + ":" + conn.port
	client, err := ssh.Dial(protocol, addr, conn.config)
	if err != nil {
		return nil, err
	}
	return client, nil
}

type Pty struct {
	term   string // will most likely be a const string for the foreseeable future
	height int
	width  int
	modes  ssh.TerminalModes
}

func CreatePty(height, width int) Pty {
	return Pty{
		term:   "xterm",
		height: height,
		width:  width,
		modes: ssh.TerminalModes{
			ssh.ECHO:          0,     // disable echoing
			ssh.TTY_OP_ISPEED: 14400, // input speed = 14.4kbaud
			ssh.TTY_OP_OSPEED: 14400, // output speed = 14.4kbaud
		},
	}
}

type SshSession struct {
	// could store connection info for metadata purposes
	client  *ssh.Client
	pty     Pty
	session *ssh.Session
}

func CreateSession(client *ssh.Client, pty Pty) (*SshSession, error) {
	session, err := client.NewSession()
	if err != nil {
		return nil, err
	}
	session.RequestPty(pty.term, pty.height, pty.width, pty.modes)
	return &SshSession{
		client:  client,
		pty:     pty,
		session: session,
	}, nil
}

func (s *SshSession) StartShell() error {
	defer s.client.Close()
	defer s.session.Close()

	s.session.Stdout = os.Stdout
	s.session.Stdin = os.Stdin
	s.session.Stderr = os.Stderr

	if err := s.session.Shell(); err != nil {
		return err
	}

	if err := s.session.Wait(); err != nil {
		return err
	}
	return nil
}

func main() {
	logger := log.Default()
	var (
		user = "dummy"
		auth = []ssh.AuthMethod{
			ssh.Password("password"),
		}
		host = "localhost"
		port = "2222"

		hostkeycb = ssh.InsecureIgnoreHostKey()
	)
	const (
		protocol = "tcp"
		ttl      = 30 * time.Minute
	)
	config := CreateConfig(user, auth, hostkeycb, ttl)
	conn := &SshConnection{
		config: config,
		host:   host,
		port:   port,
	}
	client, err := CreateClient(conn)
	if err != nil {
		logger.Fatal("Failed to create client: ", err)
	}
	pty := CreatePty(80, 40)
	s, err := CreateSession(client, pty)
	if err != nil {
		logger.Fatal("Failed to create ssh session: ", err)
	}
	if err := s.StartShell(); err != nil {
		logger.Fatal("Failed to start shell: ", err)
	}
}
