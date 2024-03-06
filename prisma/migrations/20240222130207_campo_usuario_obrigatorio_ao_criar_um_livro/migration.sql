/*
  Warnings:

  - Made the column `userId` on table `books` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "books" DROP CONSTRAINT "books_userId_fkey";

-- AlterTable
ALTER TABLE "books" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
