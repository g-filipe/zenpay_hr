/*
  Warnings:

  - You are about to drop the column `total_discount__8h` on the `MealVoucher` table. All the data in the column will be lost.
  - Added the required column `total_discount_8h` to the `MealVoucher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MealVoucher" DROP COLUMN "total_discount__8h",
ADD COLUMN     "total_discount_8h" DOUBLE PRECISION NOT NULL;
