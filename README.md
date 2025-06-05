# web-ssh
A web based ssh client that centralizes all of your passwords and connections. 

Aiming to provide a modern experience to remote-based terminal workflows. (Name Here) provides the ability to save and manage remote connections from any machine, open multiple terminal sessions, and automate ssh key generation &mdash; without installing any software.

## Current Features
- Basic SSH connection

## Architecture
This application currently consists of three core components (Updating as I go):  
### SSH Client:
Manages terminal sessions 
- Spawns a pty process 
- Creates ssh connection
- Streams i/o to client via websocket
### Web Client:
- Initiates SSH session through SSH client
- Displays terminal output and captures user input
### REST API:
- Auth
- Manage ssh config (fetch, create, delete, etc) 
<!-- - Insert UML diagram here -->
### Planned Components
This section outlines future components that are actively being built or have been planned for future development.
### Diagram

## Get Started

### Development
Dev environment coming soon

### How to Run
If you're looking to try this application out make sure you're in the root directory and perform the following:
```bash
$ docker compose up
```
This spins up 2 containers: 
- Openssh-server: For easy testing if you don't have a server to connect to
- Webssh-ssh-client: ssh client for web ssh  
**Note**: the container for the client side is a WIP, for now this is how you can run the client side
From the root directory
```bash
$ cd ./web-ssh/client && npm install && npm run dev
```
On your browser type in http://localhost:3000 and start an ssh connection from there!

