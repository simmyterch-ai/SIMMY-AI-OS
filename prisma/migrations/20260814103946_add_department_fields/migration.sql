/*
  Warnings:

  - A unique constraint covering the columns `[organizationId,name]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organizationId,name]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Department" DROP CONSTRAINT "Department_organizationId_fkey";

-- DropIndex
DROP INDEX "Team_departmentId_idx";

-- DropIndex
DROP INDEX "User_teamId_idx";

-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "departmentId" TEXT,
ADD COLUMN     "employeeCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "manager" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Active';

-- CreateIndex
CREATE UNIQUE INDEX "Team_organizationId_name_key" ON "Team"("organizationId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "User_organizationId_name_key" ON "User"("organizationId", "name");

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
