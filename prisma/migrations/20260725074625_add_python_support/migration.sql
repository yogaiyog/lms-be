-- AlterEnum
ALTER TYPE "TaskType" ADD VALUE 'PYTHON';

-- AlterTable
ALTER TABLE "TopicTask" ADD COLUMN     "defaultCode" TEXT,
ADD COLUMN     "instructions" TEXT;
