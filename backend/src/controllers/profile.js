const prisma = require("../prisma_client/prisma_client");
const cloudinary = require("../functions/cloudinary");

//GET PROFILE DATA
module.exports.profileData = async (req, res) => {
  const profileData = await prisma.user.findUnique({
    where: {
      username: req.user.username,
    },
  });
  res.json({ profileData, message: "profile data" });
};
//ADD PROFILE PIC
module.exports.newProfilePic = async (req, res) => {
  const cloudinaryImage = await cloudinary.uploader.upload(
    `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
    { resource_type: "auto" } // Automatically detect resource type
  );

  await prisma.user.update({
    where: {
      username: req.user.username,
    },
    data: {
      profilePic: cloudinaryImage.secure_url,
    },
  });
  res.json({ imageUrl: cloudinaryImage.secure_url });
};
//GET PROFILE POSTS
module.exports.profilePosts = async (req, res) => {
  const profilePosts = await prisma.posts.findMany({
    where: {
      authorUsername: req.user.username,
    },
    orderBy: {
      id: "desc",
    },
  });
  res.json({ profilePosts, message: "my posts" });
};
//DELETE POST
module.exports.deletePost = async (req, res) => {
  await prisma.posts.delete({
    where: {
      id: req.body.postId,
    },
  });
  res.json({ message: "delete post" });
};
//GET PROFILE FOLLOWING
module.exports.profileFollowing = async (req, res) => {
  const profileFollowing = await prisma.follows.findMany({
    where: {
      followedByUsername: req.user.username,
    },
    select: {
      followingUsername: true,
      following: {
        select: { profilePic: true },
      },
    },
  });
  res.json({ profileFollowing, message: "following" });
};
//GET PROFILE FOLLOWERS
module.exports.profileFollowers = async (req, res) => {
  const profileFollowers = await prisma.follows.findMany({
    where: {
      followingUsername: req.user.username,
    },
    select: {
      followedByUsername: true,
      followedBy: {
        select: { profilePic: true },
      },
    },
  });
  res.json({ profileFollowers, message: "followers" });
};
//DELETE FOLLOWING
module.exports.deleteFollowing = async (req, res) => {
  await prisma.follows.delete({
    where: {
      followingUsername_followedByUsername: {
        followingUsername: req.body.username,
        followedByUsername: req.user.username,
      },
    },
  });
  res.json({ message: "delete following" });
};
//DELETE FOLLOWER
module.exports.deleteFollower = async (req, res) => {
  await prisma.follows.delete({
    where: {
      followingUsername_followedByUsername: {
        followingUsername: req.user.username,
        followedByUsername: req.body.username,
      },
    },
  });
  res.json({ message: "delete follower" });
};
//GET PROFILE COMMENTS
module.exports.profileComments = async (req, res) => {
  const profileComments = await prisma.comments.findMany({
    where: {
      commentedByUsername: req.user.username,
    },
    orderBy: {
      id: "desc",
    },
  });
  console.log(profileComments);
  res.json({ profileComments, message: "get profile comments" });
};
//DELETE COMMENT
module.exports.deleteComment = async (req, res) => {
  await prisma.comments.delete({
    where: {
      id: req.body.commentId,
    },
  });
  res.json({ message: "comment deleted" });
};
//LOG OUT
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie("connect.sid"); // Clear the session cookie
      res.status(200).json({ message: "logout" });
    });
  });
};
