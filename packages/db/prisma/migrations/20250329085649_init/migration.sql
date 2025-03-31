/*
  Warnings:

  - You are about to drop the column `group` on the `PyqPaper` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `combination` to the `PyqPaper` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `PyqPaper` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `semester` on the `PyqPaper` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `subject` on the `PyqPaper` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Semester" AS ENUM ('SEM1', 'SEM2', 'SEM3', 'SEM4', 'SEM5', 'SEM6');

-- CreateEnum
CREATE TYPE "Combination" AS ENUM ('BSC', 'BCom', 'BBA', 'BA', 'BZC', 'BCA', 'NCZ');

-- CreateEnum
CREATE TYPE "SubjectType" AS ENUM ('Mathematics_BSC', 'Physics_BSC', 'Chemistry_BSC', 'Biology_BSC', 'ComputerScience_BSC', 'Accounting_BCom', 'Economics_BCom', 'BusinessStudies_BCom', 'Finance_BCom', 'Taxation_BCom', 'History_BA', 'PoliticalScience_BA', 'Psychology_BA', 'Sociology_BA', 'EnglishLiterature_BA', 'Philosophy_MA', 'Linguistics_MA', 'FineArts_MA', 'Literature_MA', 'CulturalStudies_MA', 'Marketing_MBA', 'MachineLearning_PhD');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('User', 'Admin');

-- CreateEnum
CREATE TYPE "DegreeType" AS ENUM ('underGraduation', 'postGraduation');

-- AlterTable
ALTER TABLE "PyqPaper" DROP COLUMN "group",
ADD COLUMN     "combination" "Combination" NOT NULL,
ADD COLUMN     "type" "DegreeType" NOT NULL,
DROP COLUMN "semester",
ADD COLUMN     "semester" "Semester" NOT NULL,
DROP COLUMN "subject",
ADD COLUMN     "subject" "SubjectType" NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'User';

-- DropEnum
DROP TYPE "RoleType";
