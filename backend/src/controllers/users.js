const prisma = require("../prisma_client/prisma_client");

//GET FRIEND REQUESTS
module.exports.getFriendRequests = async (req, res) => {
  try {
    const friendRequests = await prisma.followReqs.findMany({
      where: {
        followReqToUsername: req.user.username,
      },
      include: {
        followReqFrom: { select: { profilePic: true } },
      },
    });
    return res.json({ friendRequests, message: "friend requests" });
  } catch (err) {
    return next(err);
  }
};
//ACCEPT FRIEND REQUEST
module.exports.acceptFriendRequest = async (req, res) => {
  try {
    await prisma.follows.create({
      data: {
        followingUsername: req.user.username,
        followedByUsername: req.body.username,
      },
    });
    return res.json({ message: "accept friend", fromUser: req.body.username });
  } catch (err) {
    // P2002: Unique constraint failed (User already accepted/is following)
    if (err.code === "P2002") {
      return res.status(409).json({ message: "You are already friends" });
    }
    return next(err);
  }
};
//DENY FRIEND REQUEST
module.exports.denyFriendRequest = async (req, res) => {
  try {
    await prisma.followReqs.delete({
      where: {
        followReqToUsername_followReqFromUsername: {
          followReqToUsername: req.user.username,
          followReqFromUsername: req.body.username,
        },
      },
    });
    return res.json({ message: "deny friend" });
  } catch (err) {
    // P2025: Record to delete does not exist (Already denied/deleted)
    if (err.code === "P2025") {
      return res.json({ message: "deny friend" });
    }
    return next(err);
  }
};
//GET ALL USERS
module.exports.users = async (req, res) => {
  try {
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
    });
    return res.json({ users, message: "users" });
  } catch (err) {
    return next(err);
  }
};
//SEARCH USER
module.exports.searchUser = async (req, res) => {
  try {
    const searchInput = req.params.userToSearch.replaceAll("_", "\\_").replaceAll("Z", ".");

    const users = await prisma.user.findMany({
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
            followReqFromUsername:
              req.user.username /* Differentiate users i sent follow request to those who i did not*/,
          },
          select: {
            followReqFromUsername: true,
          },
        },
      },
    });
    return res.json({ users, message: "users" });
  } catch (err) {
    return next(err);
  }
};
//SEND FRIEND REQUEST
module.exports.sendFriendRequest = async (req, res) => {
  try {
    await prisma.followReqs.create({
      data: {
        followReqToUsername: req.body.username,
        followReqFromUsername: req.user.username,
      },
    });
    return res.json({ message: "friend request sent" });
  } catch (err) {
    if (err.code === "P2002") {
      console.log("Duplicate friend request detected and ignored.");
      return res.status(409).json({ message: "Friend request already sent" });
    }
    return next(err);
  }
};
//DELETE FRIEND REQUEST
module.exports.deleteFriendRequest = async (req, res, next) => {
  try {
    await prisma.followReqs.delete({
      where: {
        followReqToUsername_followReqFromUsername: {
          followReqToUsername: req.body.username,
          followReqFromUsername: req.user.username,
        },
      },
    });
    return res.json({ message: "delete friend request" });
  } catch (err) {
    // P2025: Record not found (User double clicked unsend)
    if (err.code === "P2025") {
      return res.json({ message: "delete friend request" });
    }
    return next(err);
  }
};
