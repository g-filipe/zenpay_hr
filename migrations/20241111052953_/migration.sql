/*
  Warnings:

  - Added the required column `total_days_6h_discounted` to the `MealVoucher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_days_8h_discounted` to the `MealVoucher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_days_discounted` to the `MealVoucher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_discount` to the `MealVoucher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_discount_6h` to the `MealVoucher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_discount__8h` to the `MealVoucher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MealVoucher" ADD COLUMN     "total_days_6h_discounted" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "total_days_8h_discounted" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "total_days_discounted" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "total_discount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "total_discount_6h" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "total_discount__8h" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "unjustified_absences_previous_month" INTEGER[];
