/*
  Warnings:

  - The `status` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[slug]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('COMPLETE', 'ONGOING');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "bannerImage" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "thumbnail" TEXT,
ALTER COLUMN "startDate" DROP NOT NULL,
ALTER COLUMN "startDate" SET DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "status",
ADD COLUMN     "status" "ProjectStatus" NOT NULL DEFAULT 'ONGOING';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "country" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "userId" TEXT;

-- CreateTable
CREATE TABLE "ProjectComment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- AddForeignKey
ALTER TABLE "ProjectComment" ADD CONSTRAINT "ProjectComment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
