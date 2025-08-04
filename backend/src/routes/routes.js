const { Router } = require("express")
const isAuth = require("../functions/isAuthenticated")
const routes = Router()
const signup = require("../controllers/signup")
const login = require("../controllers/login")

//CHECK IS NOT LOGGED IN
routes.get("/isNotAuthenticated", isAuth.checkNotAuthenticated, (req, res) => res.sendStatus(200))
//SIGN UP
routes.post("/signup", signup.signup)
//LOG IN
routes.post("/login", isAuth.checkNotAuthenticated, login.login)

module.exports = routes
