import { Queue } from "bullmq";
import { redis } from "../db/redis.js";

export const documentQueue = new Queue("document-processing", {
  connection: redis
});
