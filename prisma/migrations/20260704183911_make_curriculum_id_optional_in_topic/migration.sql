-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Topic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "curriculumId" TEXT,
    "title" TEXT NOT NULL,
    "materialLink" TEXT,
    "exampleProjectLink" TEXT,
    "goals" TEXT,
    "tools" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Topic_curriculumId_fkey" FOREIGN KEY ("curriculumId") REFERENCES "Curriculum" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Topic" ("createdAt", "curriculumId", "exampleProjectLink", "goals", "id", "materialLink", "order", "title", "tools", "updatedAt") SELECT "createdAt", "curriculumId", "exampleProjectLink", "goals", "id", "materialLink", "order", "title", "tools", "updatedAt" FROM "Topic";
DROP TABLE "Topic";
ALTER TABLE "new_Topic" RENAME TO "Topic";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
