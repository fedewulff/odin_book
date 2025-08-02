/*
  Warnings:

  - You are about to drop the column `madeByUsername` on the `Comments` table. All the data in the column will be lost.
  - The primary key for the `Likes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Likes` table. All the data in the column will be lost.
  - You are about to drop the column `madeByUsername` on the `Posts` table. All the data in the column will be lost.
  - Added the required column `commentedByUsername` to the `Comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorUsername` to the `Posts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_madeByUsername_fkey";

-- DropForeignKey
ALTER TABLE "Posts" DROP CONSTRAINT "Posts_madeByUsername_fkey";

-- DropIndex
DROP INDEX "Likes_postLikedId_likedByUsername_key";

-- AlterTable
ALTER TABLE "Comments" DROP COLUMN "madeByUsername",
ADD COLUMN     "commentedByUsername" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Likes" DROP CONSTRAINT "Likes_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Likes_pkey" PRIMARY KEY ("postLikedId", "likedByUsername");

-- AlterTable
ALTER TABLE "Posts" DROP COLUMN "madeByUsername",
ADD COLUMN     "authorUsername" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_authorUsername_fkey" FOREIGN KEY ("authorUsername") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_commentedByUsername_fkey" FOREIGN KEY ("commentedByUsername") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
