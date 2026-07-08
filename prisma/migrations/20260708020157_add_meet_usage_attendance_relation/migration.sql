/*
  Warnings:

  - Added the required column `attendanceId` to the `MeetUsage` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MeetUsage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "enrollmentId" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "attendanceId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MeetUsage_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MeetUsage_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MeetUsage_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "Attendance" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MeetUsage" ("createdAt", "date", "enrollmentId", "id", "scheduleId", "studentId") SELECT "createdAt", "date", "enrollmentId", "id", "scheduleId", "studentId" FROM "MeetUsage";
DROP TABLE "MeetUsage";
ALTER TABLE "new_MeetUsage" RENAME TO "MeetUsage";
CREATE UNIQUE INDEX "MeetUsage_attendanceId_key" ON "MeetUsage"("attendanceId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
