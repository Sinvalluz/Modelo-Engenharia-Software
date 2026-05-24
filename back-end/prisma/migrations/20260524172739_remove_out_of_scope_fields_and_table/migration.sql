/*
  Warnings:

  - You are about to drop the column `account` on the `Launch` table. All the data in the column will be lost.
  - You are about to drop the column `installments_quantity` on the `Launch` table. All the data in the column will be lost.
  - You are about to drop the column `payment_method` on the `Launch` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Launch" DROP COLUMN "account",
DROP COLUMN "installments_quantity",
DROP COLUMN "payment_method";

-- DropEnum
DROP TYPE "AccountType";

-- DropEnum
DROP TYPE "PaymentMethod";
