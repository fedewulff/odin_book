const prisma = require("../prisma_client/prisma_client")

//GET PROFILE DATA
module.exports.profileData = async (req, res) => {
  const profileData = await prisma.user.findUnique({
    where: {
      username: req.user.username,
    },
  })
  res.json({ profileData })
}
//GET PROFILE POSTS
module.exports.profilePosts = async (req, res) => {
  const profilePosts = await prisma.posts.findMany({
    where: {
      authorUsername: req.user.username,
    },
  })
  res.json({ profilePosts })
}
//DELETE POST
module.exports.deletePost = async (req, res) => {
  await prisma.posts.delete({
    where: {
      id: req.body.postId,
    },
  })
  res.sendStatus(200)
}
//GET PROFILE FOLLOWING
module.exports.profileFollowing = async (req, res) => {
  const profileFollowing = await prisma.follows.findMany({
    where: {
      followedByUsername: req.user.username,
    },
    select: {
      followingUsername: true,
    },
  })
  res.json({ profileFollowing })
}
//GET PROFILE FOLLOWERS
module.exports.profileFollowers = async (req, res) => {
  const profileFollowers = await prisma.follows.findMany({
    where: {
      followingUsername: req.user.username,
    },
    select: {
      followedByUsername: true,
    },
  })
  res.json({ profileFollowers })
}
//DELETE FOLLOWING
module.exports.deleteFollowing = async (req, res) => {
  await prisma.follows.delete({
    where: {
      followingUsername_followedByUsername: {
        followingUsername: req.body.username,
        followedByUsername: req.user.username,
      },
    },
  })
  res.sendStatus(200)
}
//DELETE FOLLOWER
module.exports.deleteFollower = async (req, res) => {
  await prisma.follows.delete({
    where: {
      followingUsername_followedByUsername: {
        followingUsername: req.user.username,
        followedByUsername: req.body.username,
      },
    },
  })
  res.sendStatus(200)
}
//GET PROFILE COMMENTS
module.exports.profileComments = async (req, res) => {
  const profileComments = await prisma.comments.findMany({
    where: {
      commentedByUsername: req.user.username,
    },
  })
  res.json({ profileComments })
}
//DELETE POST
module.exports.deleteComment = async (req, res) => {
  await prisma.comments.delete({
    where: {
      id: req.body.commentId,
    },
  })
  res.sendStatus(200)
}
//LOG OUT
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err)
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err)
      }
      res.clearCookie("connect.sid") // Clear the session cookie
      res.status(200).send("Logged out successfully")
    })
  })
}
