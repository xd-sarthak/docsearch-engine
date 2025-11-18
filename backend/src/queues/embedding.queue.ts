import { Queue } from "bullmq";
import { redis } from "../db/redis.js";

export const embeddingQueue = new Queue("embedding-processing", {
  connection: redis
});
