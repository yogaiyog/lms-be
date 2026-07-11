PRAGMA foreign_keys = OFF;

CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "label" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "CurriculumCategory" (
    "curriculumId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    PRIMARY KEY ("curriculumId", "categoryId"),
    FOREIGN KEY ("curriculumId") REFERENCES "Curriculum"("id") ON DELETE CASCADE,
    FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Curriculum_new" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "assessmentSetId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    FOREIGN KEY ("assessmentSetId") REFERENCES "AssessmentSet"("id")
);
INSERT INTO "Curriculum_new" ("id", "name", "assessmentSetId", "createdAt", "updatedAt")
    SELECT "id", "name", "assessmentSetId", "createdAt", "updatedAt" FROM "Curriculum";
DROP TABLE "Curriculum";
ALTER TABLE "Curriculum_new" RENAME TO "Curriculum";

PRAGMA foreign_keys = ON;
