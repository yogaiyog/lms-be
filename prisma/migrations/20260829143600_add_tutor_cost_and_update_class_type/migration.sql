-- AlterTable
ALTER TABLE "Class" ALTER COLUMN "type" SET DEFAULT 'BATCH810',
ADD COLUMN     "tutorCost" DECIMAL(10,2);

-- CreateTable
CREATE TABLE "TutorCost" (
    "id" TEXT NOT NULL,
    "classType" TEXT NOT NULL,
    "cost" DECIMAL(10,2) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TutorCost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TutorCost_classType_key" ON "TutorCost"("classType");
