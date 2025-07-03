import Redis from "ioredis"
import dotenv from "dotenv"

//Conexão com a base de dados UPSTASH Redis.

dotenv.config()

export const redis = new Redis(process.env.UPSTASH_REDIS_URL);