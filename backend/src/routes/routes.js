const { Router } = require("express")
const isAuth = require("../functions/isAuthenticated")
const routes = Router()
const signup = require("../controllers/signup")
const login = require("../controllers/login")

//SIGN UP
routes.post("/signup", signup.signup)
//LOG IN
routes.post("/login", isAuth.checkNotAuthenticated, login.login)

module.exports = routes
