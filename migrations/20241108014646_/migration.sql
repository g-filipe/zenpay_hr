-- CreateTable
CREATE TABLE "EmployeeDapartments" (
    "employee_id" INTEGER NOT NULL,
    "department_id" INTEGER NOT NULL,

    CONSTRAINT "EmployeeDapartments_pkey" PRIMARY KEY ("employee_id","department_id")
);

-- AddForeignKey
ALTER TABLE "EmployeeDapartments" ADD CONSTRAINT "EmployeeDapartments_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeDapartments" ADD CONSTRAINT "EmployeeDapartments_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
