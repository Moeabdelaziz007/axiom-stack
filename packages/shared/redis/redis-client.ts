import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://default:hOgB8zfnI5UcRqfnuAw3ehX5a6Fzs4gr@redis-13608.c84.us-east-1-2.ec2.cloud.redislabs.com:13608';

export const redis = new Redis(REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    }
});

redis.on('connect', () => {
    console.log('[Redis] Connected successfully');
});

redis.on('error', (err) => {
    console.error('[Redis] Connection error:', err);
});

/**
 * Get hot state from Redis (conversation cache, recent market data)
 */
export async function getHotState(key: string): Promise<string | null> {
    try {
        return await redis.get(key);
    } catch (error) {
        console.error(`[Redis] Error getting key ${key}:`, error);
        return null;
    }
}

/**
 * Set hot state in Redis with optional TTL
 */
export async function setHotState(
    key: string,
    value: string,
    ttlSeconds?: number
): Promise<'OK' | null> {
    try {
        if (ttlSeconds) {
            return await redis.setex(key, ttlSeconds, value);
        }
        return await redis.set(key, value);
    } catch (error) {
        console.error(`[Redis] Error setting key ${key}:`, error);
        return null;
    }
}

/**
 * Delete key from Redis
 */
export async function deleteHotState(key: string): Promise<number> {
    try {
        return await redis.del(key);
    } catch (error) {
        console.error(`[Redis] Error deleting key ${key}:`, error);
        return 0;
    }
}

/**
 * Check if key exists in Redis
 */
export async function hasHotState(key: string): Promise<boolean> {
    try {
        const result = await redis.exists(key);
        return result === 1;
    } catch (error) {
        console.error(`[Redis] Error checking key ${key}:`, error);
        return false;
    }
}
