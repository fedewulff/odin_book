module.exports.checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  return res.status(401).json({ msg: "not authenticated" }) //REDIRECT
}

module.exports.checkNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.sendStatus(409) //ATTEMTED RE LOGIN ALREADY AUTHENTICATED
  }
  next()
}
