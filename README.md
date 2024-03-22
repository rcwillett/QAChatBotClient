# QA Chat Client
---

## Introduction

This is the client side of a chat room application. After entering a username, users will be able to ask questions and answer other users questions. When used in tandem with the QA Chat Server application, user's answers to other user's questions will be recorded and a chatbot will automatically reply to answered questions.

## Running this App
In order to run this app you will need Git, Node.js v20.11.1 and npm V10.2.4 or up installed on your machine. After cloning this repo to your local machine, add a .env file with the following content:
```VITE_APP_API_URL="<Your server base URL Here>"```

Once this is done, to run in dev mode, go to the root of the folder in a command prompt with node and run `npm install` and `npm run dev` to start the application.

## Technical Details
This app has been built using React.js and Material UI for the framework and component libraries. Socket.io  to implement websockets used for the chat.