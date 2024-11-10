-- DropForeignKey
ALTER TABLE "EmployeeDapartments" DROP CONSTRAINT "EmployeeDapartments_department_id_fkey";

-- DropForeignKey
ALTER TABLE "EmployeeDapartments" DROP CONSTRAINT "EmployeeDapartments_employee_id_fkey";

-- AddForeignKey
ALTER TABLE "EmployeeDapartments" ADD CONSTRAINT "EmployeeDapartments_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeDapartments" ADD CONSTRAINT "EmployeeDapartments_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;
