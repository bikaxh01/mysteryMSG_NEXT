/*
  Warnings:

  - The primary key for the `message` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ids` on the `message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "message" DROP CONSTRAINT "message_pkey",
DROP COLUMN "ids",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "message_pkey" PRIMARY KEY ("id");
