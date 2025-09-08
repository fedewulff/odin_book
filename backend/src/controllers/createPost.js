const { session } = require("passport")
const prisma = require("../prisma_client/prisma_client")
const { io } = require("../server")

//CREATE POST

io.on("connection", (socket) => {
  if (socket.request.session.passport && !socket.username) {
    socket.username = socket.request.session.passport.user
  }
  console.log(socket.request.session.passport, "socket id:", socket.id)
  socket.on("new post", async (data) => {
    try {
      await prisma.posts.create({
        data: {
          text: data.postText || "",
          authorUsername: socket.username,
        },
      })
      const followedBy = await prisma.follows.findMany({
        where: {
          followingUsername: socket.username,
        },
        // include:{
        //   user:{online:true}
        // },
        select: {
          followedByUsername: true,
        },
      })
      const sockets = await io.fetchSockets()
      const friendSockets = sockets.filter((x) => {
        return followedBy.some((followedByUser) => followedByUser.followedByUsername === x.username)
      })
      const friends = friendSockets.map((x) => {
        return x.id
      })
      friends.forEach((friend) => {
        io.to(friend).emit("new post")
      })
    } catch (error) {
      console.error(error)
      socket.emit("server error")
    }
  })
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})

//CREATE POST
module.exports.createPost = async (req, res) => {
  res.sendStatus(200)
}
