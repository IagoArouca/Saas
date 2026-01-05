/*
  Warnings:

  - You are about to drop the column `youtube` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "youtube",
ADD COLUMN     "email" TEXT;
