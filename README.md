# web-ssh
A web based ssh client that centralizes all of your passwords and connections. 

Aiming to provide a modern experience to remote-based terminal workflows. (Name Here) provides the ability to save and manage remote connections from any machine, open multiple terminal sessions, and automate ssh key generation &mdash; without installing any software.

## Current Features
- Basic SSH connection

## Architecture
This application currently consists of two core components (Updating as I go):  
### SSH Client:
Manages terminal sessions 
- Spawns a pty process 
- Creates ssh connection
- Streams i/o to client via websocket
### Web Client:
User facing part of the application 
- Initiates SSH session through SSH client
- Displays terminal output and captures user input
<!-- - Insert UML diagram here -->
### Planned Components
This section outlines future components that are actively being built or have been planned for future development.
### Diagram

## Get Started
Currently in development mode, docker setup will be available by the end of the week.

