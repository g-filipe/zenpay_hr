/*
  Warnings:

  - You are about to drop the `Period` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MealVoucher" DROP CONSTRAINT "MealVoucher_month_year_fkey";

-- DropForeignKey
ALTER TABLE "Workdays" DROP CONSTRAINT "Workdays_month_year_fkey";

-- DropTable
DROP TABLE "Period";
