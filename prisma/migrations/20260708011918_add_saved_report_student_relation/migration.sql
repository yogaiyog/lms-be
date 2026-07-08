/*
  Warnings:

  - You are about to drop the column `tutorId` on the `Class` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "curriculumId" TEXT NOT NULL,
    "certificateNumber" TEXT NOT NULL,
    "grade" TEXT,
    "filePath" TEXT,
    "issuedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Certificate_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Certificate_curriculumId_fkey" FOREIGN KEY ("curriculumId") REFERENCES "Curriculum" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ClassTutors" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ClassTutors_A_fkey" FOREIGN KEY ("A") REFERENCES "Class" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ClassTutors_B_fkey" FOREIGN KEY ("B") REFERENCES "TutorProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Class" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'BATCH',
    "category" TEXT NOT NULL,
    "curriculumId" TEXT,
    "batch" INTEGER NOT NULL,
    "startDate" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isOffline" BOOLEAN NOT NULL DEFAULT false,
    "location" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Class_curriculumId_fkey" FOREIGN KEY ("curriculumId") REFERENCES "Curriculum" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Class" ("batch", "category", "createdAt", "curriculumId", "id", "isActive", "name", "startDate", "type", "updatedAt") SELECT "batch", "category", "createdAt", "curriculumId", "id", "isActive", "name", "startDate", "type", "updatedAt" FROM "Class";
DROP TABLE "Class";
ALTER TABLE "new_Class" RENAME TO "Class";
CREATE TABLE "new_SavedReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tutorId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SavedReport_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "TutorProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SavedReport_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SavedReport" ("createdAt", "data", "id", "studentId", "title", "tutorId", "updatedAt") SELECT "createdAt", "data", "id", "studentId", "title", "tutorId", "updatedAt" FROM "SavedReport";
DROP TABLE "SavedReport";
ALTER TABLE "new_SavedReport" RENAME TO "SavedReport";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_certificateNumber_key" ON "Certificate"("certificateNumber");

-- CreateIndex
CREATE INDEX "Certificate_studentId_idx" ON "Certificate"("studentId");

-- CreateIndex
CREATE INDEX "Certificate_curriculumId_idx" ON "Certificate"("curriculumId");

-- CreateIndex
CREATE UNIQUE INDEX "_ClassTutors_AB_unique" ON "_ClassTutors"("A", "B");

-- CreateIndex
CREATE INDEX "_ClassTutors_B_index" ON "_ClassTutors"("B");
