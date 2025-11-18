import { Worker } from "bullmq";
import { redis } from "../db/redis.js";
import { prisma } from "../db/prisma.js";
import axios from "axios";

console.log("📌 Embedding worker starting...");

export const embeddingWorker = new Worker(
  "embedding-processing",
  async (job) => {
    const { documentId } = job.data;

    const chunks = await prisma.documentChunk.findMany({
      where: { documentId },
      orderBy: { createdAt: "asc" }
    });

    const texts = chunks.map(c => c.content);

    // call embedding service
    const response = await axios.post(
      process.env.EMBEDDING_SERVICE_URL!,
      { texts }
    );

    const vectors = response.data.vectors;

    for (let i = 0; i < chunks.length; i++) {
        await prisma.chunkEmbedding.create({
            data: {
              chunkId: chunks[i].id,
              embedding: vectors[i]
            }
          });
          
    }

    await prisma.document.update({
      where: { id: documentId },
      data: { status: "ready" }
    });

    return { total: vectors.length };
  },
  { connection: redis }
);
