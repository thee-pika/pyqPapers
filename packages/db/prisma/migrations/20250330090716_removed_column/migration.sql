/*
  Warnings:

  - You are about to drop the column `type` on the `PyqPaper` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PyqPaper" DROP COLUMN "type";

-- DropEnum
DROP TYPE "DegreeType";
