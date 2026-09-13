/*
  Warnings:

  - A unique constraint covering the columns `[organizationId,name]` on the table `Role` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Role_name_key";

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "organizationId" INTEGER;

-- CreateIndex
CREATE INDEX "Role_organizationId_idx" ON "Role"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_organizationId_name_key" ON "Role"("organizationId", "name");

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
