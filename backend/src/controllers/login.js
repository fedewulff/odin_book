const passport = require("passport")
require("../functions/authentication")

module.exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      return res.status(401).json({ message: "wrong credentials", info })
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err)
      }
      return res.status(200).json({ message: "login successful" })
    })
  })(req, res, next)
}
