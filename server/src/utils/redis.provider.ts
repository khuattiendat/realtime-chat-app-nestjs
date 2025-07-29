import Redis from 'ioredis';
import 'dotenv/config.js'
console.log('Redis host:', process.env.REDIS_HOST);
export const redis = new Redis(process.env.REDIS_HOST as string);
