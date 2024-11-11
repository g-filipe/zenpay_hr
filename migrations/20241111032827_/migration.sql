/*
  Warnings:

  - You are about to drop the column `value_6h` on the `MealVoucher` table. All the data in the column will be lost.
  - You are about to drop the column `value_8h` on the `MealVoucher` table. All the data in the column will be lost.
  - Added the required column `total_value_6h` to the `MealVoucher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_value_8h` to the `MealVoucher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MealVoucher" DROP COLUMN "value_6h",
DROP COLUMN "value_8h",
ADD COLUMN     "total_value_6h" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "total_value_8h" DOUBLE PRECISION NOT NULL;
