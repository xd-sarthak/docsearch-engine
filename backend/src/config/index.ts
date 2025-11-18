import dotenv from "dotenv";
dotenv.config();

const required = (value: string | undefined, key: string): string => {
  if (!value) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
  return value;
};

export const config = {
  port: Number(required(process.env.PORT, "PORT")),
  host: required(process.env.HOST, "HOST"),
  nodeEnv: process.env.NODE_ENV || "development",
  redisUrl: required(process.env.REDIS_URL, "REDIS_URL"),
};
