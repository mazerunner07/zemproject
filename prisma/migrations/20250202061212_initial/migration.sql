/*
  Warnings:

  - Made the column `clientId` on table `Payment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `clientId` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `status` on the `Task` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_clientId_fkey";

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "clientId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "clientId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userId" TEXT;

-- DropEnum
DROP TYPE "TaskStatus";
