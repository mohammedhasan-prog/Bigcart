import Redis from "ioredis"
import { configDotenv } from "dotenv";

configDotenv({
    path:'.env'
})

    
    export  const client = new Redis(process.env.UPSTASH_REDIS_URL);
    
