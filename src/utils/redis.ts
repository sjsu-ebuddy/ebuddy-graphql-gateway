import Redis from "ioredis";
import { env } from "./constants";

const redis =
    process.env.NODE_ENV === env.PROD
        ? new Redis(process.env.REDIS_URL)
        : new Redis();

export default redis;