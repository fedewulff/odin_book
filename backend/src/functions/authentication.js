const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")
const prisma = require("../prisma_client/prisma_client")

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
      })
      if (!user) {
        return done(null, false, { message: "Incorrect username" })
      }
      const match = await bcrypt.compare(password, user.password)
      if (!match) {
        return done(null, false, { message: "Incorrect password" })
      }
      const userNoPwd = await prisma.user.findUnique({
        omit: {
          password: true,
        },
        where: {
          username: username,
        },
      })
      return done(null, user)
    } catch (err) {
      return done(err)
    }
  })
)
passport.serializeUser((user, done) => {
  done(null, user.username)
})

passport.deserializeUser(async (username, done) => {
  try {
    const user = await prisma.user.findUnique({
      omit: {
        password: true,
      },
      where: {
        username: username,
      },
    })
    done(null, user)
  } catch (err) {
    done(err)
  }
})
