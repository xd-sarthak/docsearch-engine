import { Worker, Job } from "bullmq";
import { redis } from "../db/redis.js";
import { prisma } from "../db/prisma.js";
import { embeddingQueue } from "../queues/embedding.queue.js";

console.log(Object.keys(prisma));

console.log("📌 Document worker booting...");


function chunkText(text: string, size = 200) {
  const chunks = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
}

export const documentWorker = new Worker(
  "document-processing",
  async (job: Job) => {
    const { documentId } = job.data;
    
    const doc = await prisma.document.findUnique({ 
      where: { id: documentId }
    });
    if (!doc) throw new Error("Document not found");

    const chunks = chunkText((doc as any).originalContent);

    for (let i = 0; i < chunks.length; i++) {
      await prisma.documentChunk.create({
        data: {
          documentId,
          content: chunks[i],
          tokenCount: chunks[i].length
        }
      });
    }


    
    await prisma.document.update({
      where: { id: documentId },
      data: { status: "embedding" }
    });
    
    await embeddingQueue.add("embed", { documentId });

    console.log("📨 Worker received job:", job.data);


    return { chunksCreated: chunks.length };
  },
  { connection: redis }
);
