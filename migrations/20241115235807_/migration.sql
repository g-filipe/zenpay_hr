-- AlterTable
CREATE SEQUENCE department_id_seq;
ALTER TABLE "Department" ALTER COLUMN "id" SET DEFAULT nextval('department_id_seq');
ALTER SEQUENCE department_id_seq OWNED BY "Department"."id";
