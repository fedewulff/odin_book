-- AddForeignKey
ALTER TABLE "FollowReqs" ADD CONSTRAINT "FollowReqs_followReqFromUsername_fkey" FOREIGN KEY ("followReqFromUsername") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;
