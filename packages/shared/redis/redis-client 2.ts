import { createClient } from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://default:hOgB8zfnI5UcRqfnuAw3ehX5a6Fzs4gr@redis-13608.c84.us-east-1-2.ec2.cloud.redislabs.com:13608';

export const redis = createClient(redisUrl);

redis.on('error', (err) => {
    console.error('Redis error:', err);
});

export async function getHotState(key: string): Promise<string | null> {
    return redis.get(key);
}

export async function setHotState(key: string, value: string, ttlSeconds?: number): Promise<'OK'> {
    if (ttlSeconds) {
        return redis.set(key, value, 'EX', ttlSeconds);
    }
    return redis.set(key, value);
}
