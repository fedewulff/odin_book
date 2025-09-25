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

  res.json({ allPosts, message: "all posts" })
}
//LIKE POST
module.exports.likePost = async (req, res) => {
  await prisma.likes.create({
    data: {
      postLikedId: req.body.postId,
      likedByUsername: req.user.username,
    },
  })
  res.status(200).json({ message: "like post" })
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
  res.status(200).json({ message: "dislike post" })
}
//GET POST COMMENTS
module.exports.getPostComments = async (req, res) => {
  const postId = Number(req.params.postId)
  const postComments = await prisma.comments.findMany({
    where: {
      postId: postId,
    },
    orderBy: {
      id: "desc",
    },
  })
  res.json({ postComments, message: "post comments", postId })
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
  res.json({ newComment, message: "comment on post", postId: req.body.postId })
}
