-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_commentedByUsername_fkey";

-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_postId_fkey";

-- DropForeignKey
ALTER TABLE "FollowReqs" DROP CONSTRAINT "FollowReqs_followReqToUsername_fkey";

-- DropForeignKey
ALTER TABLE "Follows" DROP CONSTRAINT "Follows_followedByUsername_fkey";

-- DropForeignKey
ALTER TABLE "Follows" DROP CONSTRAINT "Follows_followingUsername_fkey";

-- DropForeignKey
ALTER TABLE "Likes" DROP CONSTRAINT "Likes_likedByUsername_fkey";

-- DropForeignKey
ALTER TABLE "Likes" DROP CONSTRAINT "Likes_postLikedId_fkey";

-- DropForeignKey
ALTER TABLE "Posts" DROP CONSTRAINT "Posts_authorUsername_fkey";

-- AlterTable
ALTER TABLE "Posts" ADD COLUMN     "showComments" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_followingUsername_fkey" FOREIGN KEY ("followingUsername") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_followedByUsername_fkey" FOREIGN KEY ("followedByUsername") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_authorUsername_fkey" FOREIGN KEY ("authorUsername") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_commentedByUsername_fkey" FOREIGN KEY ("commentedByUsername") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_postLikedId_fkey" FOREIGN KEY ("postLikedId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_likedByUsername_fkey" FOREIGN KEY ("likedByUsername") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowReqs" ADD CONSTRAINT "FollowReqs_followReqToUsername_fkey" FOREIGN KEY ("followReqToUsername") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;
