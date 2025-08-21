const prisma = require("../prisma_client/prisma_client")

//CREATE POST
module.exports.createPost = async (req, res) => {
  await prisma.posts.create({
    data: {
      text: req.body.postText || "",
      authorUsername: req.user.username,
    },
  })
  res.sendStatus(200)
}
