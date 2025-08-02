-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profilePic" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Follows" (
    "followingUsername" TEXT NOT NULL,
    "followedByUsername" TEXT NOT NULL,

    CONSTRAINT "Follows_pkey" PRIMARY KEY ("followingUsername","followedByUsername")
);

-- CreateTable
CREATE TABLE "Posts" (
    "id" SERIAL NOT NULL,
    "text" TEXT,
    "image" TEXT,
    "madeByUsername" TEXT NOT NULL,

    CONSTRAINT "Posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comments" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,
    "madeByUsername" TEXT NOT NULL,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Likes" (
    "id" SERIAL NOT NULL,
    "postLikedId" INTEGER NOT NULL,
    "likedByUsername" TEXT NOT NULL,

    CONSTRAINT "Likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FollowReqs" (
    "followReqToUsername" TEXT NOT NULL,
    "followReqFromUsername" TEXT NOT NULL,

    CONSTRAINT "FollowReqs_pkey" PRIMARY KEY ("followReqToUsername","followReqFromUsername")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Likes_postLikedId_likedByUsername_key" ON "Likes"("postLikedId", "likedByUsername");

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_followingUsername_fkey" FOREIGN KEY ("followingUsername") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_followedByUsername_fkey" FOREIGN KEY ("followedByUsername") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_madeByUsername_fkey" FOREIGN KEY ("madeByUsername") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_madeByUsername_fkey" FOREIGN KEY ("madeByUsername") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_postLikedId_fkey" FOREIGN KEY ("postLikedId") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_likedByUsername_fkey" FOREIGN KEY ("likedByUsername") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowReqs" ADD CONSTRAINT "FollowReqs_followReqToUsername_fkey" FOREIGN KEY ("followReqToUsername") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
