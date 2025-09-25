const prisma = require("../prisma_client/prisma_client")

//GET FRIEND REQUESTS
module.exports.getFriendRequests = async (req, res) => {
  const friendRequests = await prisma.followReqs.findMany({
    where: {
      followReqToUsername: req.user.username,
    },
    include: {
      followReqFrom: { select: { profilePic: true } },
    },
  })
  res.json({ friendRequests, message: "friend requests" })
}
//ACCEPT FRIEND REQUEST
module.exports.acceptFriendRequest = async (req, res) => {
  await prisma.follows.create({
    data: {
      followingUsername: req.user.username,
      followedByUsername: req.body.username,
    },
  })
  res.json({ message: "accept friend", fromUser: req.body.username })
}
//DENY FRIEND REQUEST
module.exports.denyFriendRequest = async (req, res) => {
  await prisma.followReqs.delete({
    where: {
      followReqToUsername_followReqFromUsername: {
        followReqToUsername: req.user.username,
        followReqFromUsername: req.body.username,
      },
    },
  })
  res.json({ message: "deny friend" })
}
//GET ALL USERS
module.exports.users = async (req, res) => {
  const users = await prisma.user.findMany({
    where: {
      username: {
        not: req.user.username /* Exclude me from list*/,
      },

      following: {
        none: {
          followedByUsername: req.user.username /* Exclude users i follow */,
        },
      },
    },
    include: {
      followReqTo: {
        where: {
          followReqFromUsername: req.user.username /* Differentiate users i sent follow request to those i did not*/,
        },
        select: {
          followReqFromUsername: true,
        },
      },
    },
  })

  res.json({ users, message: "users" })
}
//SEARCH USER
module.exports.searchUser = async (req, res) => {
  const searchInput = req.params.userToSearch.replaceAll("_", "\\_").replaceAll("Z", ".")
  users = await prisma.user.findMany({
    where: {
      username: {
        contains: searchInput,
        not: req.user.username /* Exclude me from list*/,
      },

      following: {
        none: {
          followedByUsername: req.user.username /* Exclude users that i follow*/,
        },
      },
    },
    include: {
      followReqTo: {
        where: {
          followReqFromUsername: req.user.username /* Differentiate users i sent follow request to those who i did not*/,
        },
        select: {
          followReqFromUsername: true,
        },
      },
    },
  })
  res.json({ users, message: "users" })
}
//SEND FRIEND REQUEST
module.exports.sendFriendRequest = async (req, res) => {
  await prisma.followReqs.create({
    data: {
      followReqToUsername: req.body.username,
      followReqFromUsername: req.user.username,
    },
  })
  res.json({ message: "friend request sent" })
}
//DELETE FRIEND REQUEST
module.exports.deleteFriendRequest = async (req, res) => {
  await prisma.followReqs.delete({
    where: {
      followReqToUsername_followReqFromUsername: {
        followReqToUsername: req.body.username,
        followReqFromUsername: req.user.username,
      },
    },
  })
  res.json({ message: "delete friend request" })
}
