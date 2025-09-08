const prisma = require("../prisma_client/prisma_client")

//GET ALL POSTS
module.exports.allPosts = async (req, res) => {
  const profileFollowing = await prisma.follows.findMany({
    where: {
      followedByUsername: req.user.username,
    },
    select: {
      followingUsername: true,
    },
  })
  const followingUsers = profileFollowing.map((user) => user.followingUsername)

  const allPosts = await prisma.posts.findMany({
    where: {
      authorUsername: {
        in: followingUsers,
      },
    },
    include: {
      likes: {
        where: {
          likedByUsername: req.user.username,
        },
        select: {
          likedByUsername: true,
        },
      },
      author: {
        select: {
          profilePic: true,
        },
      },
    },
    orderBy: {
      id: "desc",
    },
  })

  res.json({ allPosts })
}
//LIKE POST
module.exports.likePost = async (req, res) => {
  await prisma.likes.create({
    data: {
      postLikedId: req.body.postId,
      likedByUsername: req.user.username,
    },
  })
  res.sendStatus(200)
}
//DISLIKE POST
module.exports.dislikePost = async (req, res) => {
  await prisma.likes.delete({
    where: {
      postLikedId_likedByUsername: {
        postLikedId: req.body.postId,
        likedByUsername: req.user.username,
      },
    },
  })
  res.sendStatus(200)
}
//GET POST COMMENTS
module.exports.getPostComments = async (req, res) => {
  const postComments = await prisma.comments.findMany({
    where: {
      postId: Number(req.params.postId),
    },
    orderBy: {
      id: "desc",
    },
  })
  res.json({ postComments })
}
//COMMENT POST
module.exports.commentPost = async (req, res) => {
  const newComment = await prisma.comments.create({
    data: {
      text: req.body.postComment,
      postId: req.body.postId,
      commentedByUsername: req.user.username,
    },
  })
  res.json({ newComment })
}
