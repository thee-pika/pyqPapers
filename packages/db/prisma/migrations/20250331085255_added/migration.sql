/*
  Warnings:

  - Added the required column `expiryDate` to the `PyqPaper` table without a default value. This is not possible if the table is not empty.
  - Added the required column `psurl` to the `PyqPaper` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PyqPaper" ADD COLUMN     "expiryDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "psurl" TEXT NOT NULL;
