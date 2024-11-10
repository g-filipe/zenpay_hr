/*
  Warnings:

  - You are about to drop the column `unjustified_absences` on the `MealVoucher` table. All the data in the column will be lost.
  - You are about to drop the column `unjustified_absences_previous_month` on the `MealVoucher` table. All the data in the column will be lost.
  - You are about to drop the column `vacation` on the `MealVoucher` table. All the data in the column will be lost.
  - You are about to drop the column `value6h` on the `MealVoucher` table. All the data in the column will be lost.
  - You are about to drop the column `value8h` on the `MealVoucher` table. All the data in the column will be lost.
  - You are about to drop the column `worked_holidays` on the `MealVoucher` table. All the data in the column will be lost.
  - You are about to drop the column `worked_weekends` on the `MealVoucher` table. All the data in the column will be lost.
  - Added the required column `value_6h` to the `MealVoucher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value_8h` to the `MealVoucher` table without a default value. This is not possible if the table is not empty.

*/
-- Rename columns in Department, Employee, MealVoucher, and Period tables
ALTER TABLE "Department" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "Employee" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "MealVoucher" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "Period" RENAME COLUMN "createdAt" TO "created_at";

-- Drop columns from MealVoucher table
ALTER TABLE "MealVoucher" DROP COLUMN "unjustified_absences";
ALTER TABLE "MealVoucher" DROP COLUMN "unjustified_absences_previous_month";
ALTER TABLE "MealVoucher" DROP COLUMN "vacation";
ALTER TABLE "MealVoucher" DROP COLUMN "value6h";
ALTER TABLE "MealVoucher" DROP COLUMN "value8h";
ALTER TABLE "MealVoucher" DROP COLUMN "worked_holidays";
ALTER TABLE "MealVoucher" DROP COLUMN "worked_weekends";

-- Add new columns to MealVoucher table
ALTER TABLE "MealVoucher" ADD COLUMN "value_6h" DOUBLE PRECISION NOT NULL;
ALTER TABLE "MealVoucher" ADD COLUMN "value_8h" DOUBLE PRECISION NOT NULL;

-- Create Workdays table
CREATE TABLE "Workdays" (
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "worked_holidays" INTEGER[],
    "worked_weekends" INTEGER[],
    "vacation" INTEGER[],
    "unjustified_absences" INTEGER[],
    "unjustified_absences_previous_month" INTEGER[],
    "employee_id" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    CONSTRAINT "Workdays_pkey" PRIMARY KEY ("employee_id","month","year")
);

-- Add foreign keys to Workdays and MealVoucher tables
ALTER TABLE "Workdays" ADD CONSTRAINT "Workdays_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Workdays" ADD CONSTRAINT "Workdays_month_year_fkey" FOREIGN KEY ("month", "year") REFERENCES "Period"("month", "year") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "MealVoucher" ADD CONSTRAINT "MealVoucher_employee_id_month_year_fkey" FOREIGN KEY ("employee_id", "month", "year") REFERENCES "Workdays"("employee_id", "month", "year") ON DELETE RESTRICT ON UPDATE CASCADE;
