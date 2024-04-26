/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_userId_fkey";

-- DropTable
DROP TABLE "user";

-- CreateTable
CREATE TABLE "usertable" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "verifyCode" TEXT NOT NULL,
    "verifyCodeExpiry" TIMESTAMP(3) NOT NULL,
    "isVerify" BOOLEAN NOT NULL DEFAULT false,
    "isAcceptingMsg" BOOLEAN NOT NULL DEFAULT true
);

-- CreateIndex
CREATE UNIQUE INDEX "usertable_id_key" ON "usertable"("id");

-- CreateIndex
CREATE UNIQUE INDEX "usertable_username_key" ON "usertable"("username");

-- CreateIndex
CREATE UNIQUE INDEX "usertable_email_key" ON "usertable"("email");

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usertable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
