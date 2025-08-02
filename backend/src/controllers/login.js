const passport = require("passport")
require("../functions/authentication")

module.exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      return res.status(401).json({ message: "Authentication failed", info })
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err)
      }
      return res.json({ message: "Login successful", user: req.user })
    })
  })(req, res, next)
}
