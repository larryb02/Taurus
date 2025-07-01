# web-ssh
A web based ssh client that centralizes all of your passwords and connections. 

Aiming to provide a modern experience to remote-based terminal workflows. (Name Here) provides the ability to save and manage remote connections from any machine, open multiple terminal sessions, and automate ssh key generation &mdash; without installing any software.

## Current Features
- SSH Connections
    - Connect to remote servers with a terminal
- Manage SSH connections
    - Create, Update, and Delete SSH configurations

### Roadmap
This is an early prototype of a cloud based ssh platform, it currently requires a lot of trust in my infrastructure for personal use. However, I plan on implementing a zero-trust solution that:  
<!-- <style type="text/css">
    ol { list-style-type: upper-alpha; }
</style>   -->
<ol type="A">
  <li><strong>Can</strong> be deployed on your own infrastructure (However this won't be necessary)</li>
  <li>Eliminates the need to store credentials for access to remote servers</li>
  <li>Strong auth flows and access control</li>
</ol>  

## Architecture
This application currently consists of three core components:
### SSH Client:
Manages terminal sessions 
- Spawns a pty process 
- Creates ssh connection
- Streams i/o to/from client via websocket
### Web Client:
- Initiates SSH session through SSH client
- Displays terminal output and captures user input
### REST API:
- Auth
- SSH config management
<!-- - Insert UML diagram here -->
### Diagram


## Get Started (Out of Date)
**Note** These instructions are not currently up to date, but I will provide a working solution soon!
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

