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

app.set("trust proxy", 1)
const sessionMiddleware = expressSession({
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // mss
    secure: true, // Must be true when sameSite is 'none'
    sameSite: "none", //Added so it is not blocked by cross-site
  },

  resave: false,
  saveUninitialized: true,
  store: new PrismaSessionStore(prisma, {
    checkPeriod: 2 * 60 * 1000, //ms
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }),
})
// app.use(express.urlencoded({ extended: true })) /*NO ES NECESARIO, CON APIS USO expres.json()*/
app.use(express.json()) /*CONVIERTE EL JSON STRING ENVIADO EN EL PUT O POST REQ A UN OBJECT Y RELLENA REQ.BODY*/
app.use(cookieParser())
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true })) // Enable CORS for Express routes as well
app.use(sessionMiddleware)
app.use(passport.session())
app.use(cookieParser())

io.engine.use(sessionMiddleware)

app.use("/", routes)

app.use((err, req, res, next) => {
  console.error(`\x1b[31m${err}\x1b[0m`)
  res.status(err.statusCode || 500).json({ messageToUser: err.messageToUser || "Internal Server Error" })
})

const PORT = process.env.PORT || 7000
server.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`))
