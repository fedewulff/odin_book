require("dotenv").config()
const express = require("express")
const app = express()
const expressSession = require("express-session")
const { PrismaSessionStore } = require("@quixo3/prisma-session-store")
const passport = require("passport")
const prisma = require("./prisma_client/prisma_client")
const routes = require("./routes/routes")
const cors = require("cors")
const cookieParser = require("cookie-parser")

app.use(express.json()) /*CONVIERTE EL JSON STRING ENVIADO EN EL PUT O POST REQ A UN OBJECT Y RELLENA REQ.BODY*/
app.use(cookieParser())
// app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: true, credentials: true }))

app.use(
  expressSession({
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
)

app.use(passport.session())
app.use(cookieParser())

app.use("/", routes)

app.use((err, req, res, next) => {
  console.error(`\x1b[31m${err}\x1b[0m`)
  res.status(err.statusCode || 500).json({ messageToUser: err.messageToUser || "Internal Server Error" })
})

const PORT = process.env.PORT || 7000
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`))
