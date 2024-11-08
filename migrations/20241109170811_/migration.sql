/*
  Warnings:

  - You are about to drop the column `department_id` on the `Employee` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_department_id_fkey";

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "department_id";
