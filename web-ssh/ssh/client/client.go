package client

import (
	"golang.org/x/crypto/ssh"
	"golang.org/x/term"
	"io"
	"net"
	//"log"
	"os"
	"time"
)

const (
	protocol = "tcp"
	ttl      = 30 * time.Minute
)

type SshConnection struct {
	config *ssh.ClientConfig
	host   string
	port   string
}

type Pty struct {
	term   string // will most likely be a const string for the foreseeable future
	height int
	width  int
	modes  ssh.TerminalModes
}

type Terminal struct {
	fd    int
	state *term.State
}

type SshSession struct {
	// could store connection info for metadata purposes
	client  *ssh.Client
	pty     Pty
	session *ssh.Session
	term    Terminal
}

func CreateConfig(user string, auth []ssh.AuthMethod, hostkeycb ssh.HostKeyCallback, ttl time.Duration) *ssh.ClientConfig {
	return &ssh.ClientConfig{
		User:            user,
		Auth:            auth,
		HostKeyCallback: hostkeycb,
		Timeout:         ttl,
	}
}

func CreateSshConnection(config *ssh.ClientConfig, host, port string) (*SshConnection) {
	return &SshConnection{
		config: config,
		host: host,
		port: port,
	}
}

func CreateClient(conn *SshConnection) (*ssh.Client, error) {
	addr := net.JoinHostPort(conn.host, conn.port)
	client, err := ssh.Dial(protocol, addr, conn.config)
	if err != nil {
		return nil, err
	}
	return client, nil
}

func CreatePty(height, width int) Pty {
	return Pty{
		term:   "xterm-256color",
		height: height,
		width:  width,
		modes: ssh.TerminalModes{
			ssh.ECHO:          1,     // disable echoing
			ssh.TTY_OP_ISPEED: 14400, // input speed = 14.4kbaud
			ssh.TTY_OP_OSPEED: 14400, // output speed = 14.4kbaud
		},
	}
}

func CreateSession(client *ssh.Client, pty Pty) (*SshSession, error) {
	session, err := client.NewSession()
	if err != nil {
		return nil, err
	}
	fd := int(os.Stdin.Fd())

	originalState, err := term.MakeRaw(fd)
	if err != nil {
		return nil, err
	}

	err = session.RequestPty(pty.term, pty.height, pty.width, pty.modes)
	if err != nil {
		return nil, err
	}

	return &SshSession{
		client:  client,
		pty:     pty,
		session: session,
		term:    Terminal{fd, originalState},
	}, nil
}

func (s *SshSession) StartShell() error {
	defer s.client.Close()
	defer s.session.Close()
	defer term.Restore(s.term.fd, s.term.state)
	stdout, err := s.session.StdoutPipe()
	if err != nil {
		return err
	}

	stdin, err := s.session.StdinPipe()
	if err != nil {
		return err
	}
	defer stdin.Close()

	stderr, err := s.session.StderrPipe()
	if err != nil {
		return err
	}

	if err := s.session.Shell(); err != nil {
		return err
	}

	go io.Copy(os.Stdout, stdout)
	go io.Copy(os.Stderr, stderr)
	go io.Copy(stdin, os.Stdin)

	if err := s.session.Wait(); err != nil {
		return err
	}

	return nil
}
