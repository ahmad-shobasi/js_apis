-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshToken" TEXT,
ALTER COLUMN "role" DROP DEFAULT;
