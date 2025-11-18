/*
  Warnings:

  - The `embedding` column on the `ChunkEmbedding` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
ALTER TYPE "DocumentStatus" ADD VALUE 'embedding';

-- AlterTable
ALTER TABLE "ChunkEmbedding" DROP COLUMN "embedding",
ADD COLUMN     "embedding" DOUBLE PRECISION[];
