/*
  Warnings:

  - A unique constraint covering the columns `[invoiceNumber]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clientId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoiceNumber` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tax` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "clientId" TEXT NOT NULL,
ADD COLUMN     "invoiceNumber" TEXT NOT NULL,
ADD COLUMN     "tax" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "budget" INTEGER DEFAULT 0,
ADD COLUMN     "deadline" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "companyDescription" TEXT,
ADD COLUMN     "companyName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_invoiceNumber_key" ON "Payment"("invoiceNumber");
