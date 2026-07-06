import { Queue } from "bullmq";
import { config } from "../config.ts";
//
export const connection = { url: config.redisUrl };

export const VerificationEmailQueue = new Queue("send-verification-email", { connection });
