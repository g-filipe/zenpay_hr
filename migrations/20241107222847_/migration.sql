-- DropForeignKey
ALTER TABLE "Department" DROP CONSTRAINT "Department_leader_id_fkey";

-- AlterTable
ALTER TABLE "Department" ALTER COLUMN "leader_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_leader_id_fkey" FOREIGN KEY ("leader_id") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
