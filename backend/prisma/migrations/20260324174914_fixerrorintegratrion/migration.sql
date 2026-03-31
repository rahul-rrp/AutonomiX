-- DropForeignKey
ALTER TABLE "user_integrations" DROP CONSTRAINT "user_integrations_userId_fkey";

-- AddForeignKey
ALTER TABLE "user_integrations" ADD CONSTRAINT "user_integrations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
