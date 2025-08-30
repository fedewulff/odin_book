require("dotenv").config()
const express = require("express")
const cors = require("cors")
const expressSession = require("express-session")
const { PrismaSessionStore } = require("@quixo3/prisma-session-store")
const passport = require("passport")
const prisma = require("./prisma_client/prisma_client")
const routes = require("./routes/routes")
const cookieParser = require("cookie-parser")
const { app, server, io } = require("./server")

const sessionMiddleware = expressSession({
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // ms
  },
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new PrismaSessionStore(prisma, {
    checkPeriod: 2 * 60 * 1000, //ms
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }),
})
// app.use(express.urlencoded({ extended: true })) /*NO ES NECESARIO, CON APIS USO expres.json()*/
app.use(express.json()) /*CONVIERTE EL JSON STRING ENVIADO EN EL PUT O POST REQ A UN OBJECT Y RELLENA REQ.BODY*/
app.use(cookieParser())
app.use(cors({ origin: true, credentials: true })) // Enable CORS for Express routes as well
app.use(sessionMiddleware)
app.use(passport.session())
app.use(cookieParser())

io.engine.use(sessionMiddleware)
//io.on("connection", (socket) => {
//console.log(999)
//   const user = socket.request.session.passport // Access authenticated user data
//const sessionId = socket.request.session.id

//   socket.data.username = user.user
//   console.log(socket.data)
//   console.log(socket.data.username)
// console.log(socket.id)
// console.log("session id")
// console.log(sessionId)
// console.log(socket.request.session)
//   if (user) {
//     console.log(`User ${user.user} connected to Socket.IO`)
//     // Handle real-time events for authenticated users
//   } else {
//     console.log("Unauthenticated user connected to Socket.IO")
//     socket.disconnect(true) // Disconnect unauthenticated users
//   }
//   async function pepe() {
//     const sockets = await io.fetchSockets()
//     const friendSocketId = sockets.filter((x) => "roberto" === x.data.username).map((x) => x.id)
//     console.log(123)
//     console.log(friendSocketId[0])
//     // io.to(friendSocketId).emit("mensaje", { msg: "asdasd" })
//   }
//   pepe()
//   io.emit("mensaje", { msg: "asdasd" })
//   socket.on("disconnect", () => {
//     console.log(`User ${user.user} left `)
//   })
//})
app.use("/", routes)

app.use((err, req, res, next) => {
  console.error(`\x1b[31m${err}\x1b[0m`)
  res.status(err.statusCode || 500).json({ messageToUser: err.messageToUser || "Internal Server Error" })
})

const PORT = process.env.PORT || 7000
server.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`))
