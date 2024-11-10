/*
  Warnings:

  - Added the required column `total_worked_days` to the `Workdays` table without a default value. This is not possible if the table is not empty.
  - Added the required column `worked_6h` to the `Workdays` table without a default value. This is not possible if the table is not empty.
  - Added the required column `worked_8h` to the `Workdays` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Workdays" ADD COLUMN     "total_worked_days" INTEGER NOT NULL,
ADD COLUMN     "worked_6h" INTEGER NOT NULL,
ADD COLUMN     "worked_8h" INTEGER NOT NULL;
