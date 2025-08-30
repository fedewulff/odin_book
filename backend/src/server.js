const express = require("express")
const { createServer } = require("http") //PARA SOCKET
const { Server } = require("socket.io")

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", credentials: true },
}) // Initialize Socket.IO with the HTTP server

module.exports = { app, server, io }
