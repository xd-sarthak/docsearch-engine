import { FastifyInstance } from "fastify";
import { createDocumentSchema, CreateDocumentInput } from "../schemas/document.schema.js";
import { prisma } from "../db/prisma.js";
import { documentQueue } from "../queues/document.queue.js";
import type { Prisma } from "@prisma/client";

export default async function documentRoutes(app: FastifyInstance) {
  app.post("/", async (req, reply) => {
    // Validate input
    const parseResult = createDocumentSchema.safeParse({ body: req.body });
    if (!parseResult.success) {
      return reply.status(400).send({
        error: "ValidationError",
        issues: parseResult.error.issues,
      });
    }

    const { title, content } = parseResult.data.body as CreateDocumentInput;

    // Step 1: Create document
    const doc = await prisma.document.create({
      data: {
        title,
        originalContent: content,
        status: "uploaded",
      } as Prisma.DocumentCreateInput
    });

    // Step 2: Immediately mark status as processing
    await prisma.document.update({
      where: { id: doc.id },
      data: { status: "processing" }
    });

    // Step 3: Enqueue processing task
    await documentQueue.add("process", { documentId: doc.id });

    // Step 4: Respond immediately (asynchronous processing)
    return reply.status(201).send({
      documentId: doc.id,
      status: "processing"
    });
  });
}
