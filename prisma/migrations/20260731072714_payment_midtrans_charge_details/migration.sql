-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "bank" TEXT,
ADD COLUMN     "deeplinkUrl" TEXT,
ADD COLUMN     "midtransRaw" JSONB,
ADD COLUMN     "paymentType" TEXT,
ADD COLUMN     "qrString" TEXT,
ADD COLUMN     "vaNumber" TEXT;
