/*
  Warnings:

  - Added the required column `value6h` to the `MealVoucher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value8h` to the `MealVoucher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MealVoucher" ADD COLUMN     "value6h" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "value8h" DOUBLE PRECISION NOT NULL;
