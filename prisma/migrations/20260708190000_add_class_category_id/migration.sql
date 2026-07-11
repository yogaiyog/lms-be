PRAGMA foreign_keys = OFF;

-- Drop old category column, add categoryId FK to Category
CREATE TABLE IF NOT EXISTS "Class_new" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'BATCH',
    "categoryId" TEXT,
    "curriculumId" TEXT,
    "batch" INTEGER NOT NULL DEFAULT 0,
    "startDate" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isOnline" BOOLEAN NOT NULL DEFAULT true,
    "location" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    FOREIGN KEY ("categoryId") REFERENCES "Category"("id"),
    FOREIGN KEY ("curriculumId") REFERENCES "Curriculum"("id")
);
INSERT INTO "Class_new" ("id", "name", "type", "categoryId", "curriculumId", "batch", "startDate", "isActive", "isOnline", "location", "createdAt", "updatedAt")
    SELECT "id", "name", "type", NULL, "curriculumId", "batch", "startDate", "isActive", "isOnline", "location", "createdAt", "updatedAt" FROM "Class";
DROP TABLE "Class";
ALTER TABLE "Class_new" RENAME TO "Class";

PRAGMA foreign_keys = ON;
