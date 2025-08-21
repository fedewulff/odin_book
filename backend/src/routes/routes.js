const { Router } = require("express")
const isAuth = require("../functions/isAuthenticated")
const routes = Router()
const signup = require("../controllers/signup")
const login = require("../controllers/login")
const profile = require("../controllers/profile")
const createPost = require("../controllers/createPost")
const home = require("../controllers/home")
const users = require("../controllers/users")

//CHECK IS NOT LOGGED IN
routes.get("/isNotAuthenticated", isAuth.checkNotAuthenticated, (req, res) => res.sendStatus(200))
//SIGN UP
routes.post("/signup", signup.signup)
//LOG IN
routes.post("/login", isAuth.checkNotAuthenticated, login.login)
//LOG OUT
routes.post("/logout", isAuth.checkAuthenticated, profile.logout)

//PROFILE DATA
routes.get("/profileData", isAuth.checkAuthenticated, profile.profileData)
//PROFILE POSTS
routes.get("/profilePosts", isAuth.checkAuthenticated, profile.profilePosts)
//DELETE POST
routes.delete("/deletePost", isAuth.checkAuthenticated, profile.deletePost)
//PROFILE FOLLOWING
routes.get("/profileFollowing", isAuth.checkAuthenticated, profile.profileFollowing)
//PROFILE FOLLOWERS
routes.get("/profileFollowers", isAuth.checkAuthenticated, profile.profileFollowers)
//DELETE FOLLOWING
routes.delete("/deleteFollowing", isAuth.checkAuthenticated, profile.deleteFollowing)
//DELETE FOLLOWER
routes.delete("/deleteFollower", isAuth.checkAuthenticated, profile.deleteFollower)
//PROFILE COMMENTS
routes.get("/profileComments", isAuth.checkAuthenticated, profile.profileComments)
//DELETE COMMENT
routes.delete("/deleteComment", isAuth.checkAuthenticated, profile.deleteComment)

//CREATE POST
routes.post("/createPost", isAuth.checkAuthenticated, createPost.createPost)

//GET ALL POSTS
routes.get("/allPosts", isAuth.checkAuthenticated, home.allPosts)
//LIKE POST
routes.post("/likePost", isAuth.checkAuthenticated, home.likePost)
//DISLIKE POST
routes.delete("/dislikePost", isAuth.checkAuthenticated, home.dislikePost)
//GET POST COMMENTS
routes.get("/getPostComments/:postId", isAuth.checkAuthenticated, home.getPostComments)
//COMMENT POST
routes.post("/commentPost", isAuth.checkAuthenticated, home.commentPost)

//GET FRIEND REQUESTS
routes.get("/getFriendRequests", isAuth.checkAuthenticated, users.getFriendRequests)
//DENY FRIEND REQUEST
routes.post("/acceptFriendRequest", isAuth.checkAuthenticated, users.acceptFriendRequest)
//DENY FRIEND REQUEST
routes.delete("/denyFriendReq", isAuth.checkAuthenticated, users.denyFriendRequest)
//GET USERS
routes.get("/users", isAuth.checkAuthenticated, users.users)
//SEARCH USER
routes.get("/searchUser/:userToSearch", isAuth.checkAuthenticated, users.searchUser)
//SEND FRIEND REQUEST
routes.post("/sendFriendReq", isAuth.checkAuthenticated, users.sendFriendRequest)
//DELETE FRIEND REQUEST
routes.delete("/deleteFriendReq", isAuth.checkAuthenticated, users.deleteFriendRequest)

module.exports = routes
