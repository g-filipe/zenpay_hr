/*
  Warnings:

  - The primary key for the `MealVoucher` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `MealVoucher` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MealVoucher" DROP CONSTRAINT "MealVoucher_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "MealVoucher_pkey" PRIMARY KEY ("employee_id", "month", "year");
