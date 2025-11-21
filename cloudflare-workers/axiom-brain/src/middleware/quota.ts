// src/middleware/quota.ts - Quota Guard Middleware for Nano Banana Architecture
import { Context } from 'hono';

export interface QuotaGuardConfig {
  limit: number;
  resourceType: string;
  kv?: KVNamespace;
}

export class QuotaGuard {
  private limit: number;
  private resourceType: string;
  private kv: KVNamespace | null;
  private usageMap: Map<string, number>;

  constructor(config: QuotaGuardConfig) {
    this.limit = config.limit;
    this.resourceType = config.resourceType;
    this.kv = config.kv || null;
    this.usageMap = new Map<string, number>();
  }

  /**
   * Check if the resource usage is within limits
   * @returns true if within limits, false if quota exceeded
   */
  async checkQuota(): Promise<boolean> {
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const key = `quota:${this.resourceType}:${today}`;
      
      let usage = 0;
      
      // Try to get usage from KV first
      if (this.kv) {
        try {
          const kvUsage = await this.kv.get(key);
          if (kvUsage) {
            usage = parseInt(kvUsage, 10);
          }
        } catch (kvError) {
          console.warn('KV read error:', kvError);
          // Fall back to in-memory map
          usage = this.usageMap.get(key) || 0;
        }
      } else {
        // Get current usage from in-memory map
        usage = this.usageMap.get(key) || 0;
      }
      
      // Check if usage exceeds limit
      if (usage >= this.limit) {
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking quota:', error);
      // In case of error, allow the request to proceed to avoid blocking legitimate requests
      return true;
    }
  }

  /**
   * Increment the resource usage counter
   */
  async incrementUsage(): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const key = `quota:${this.resourceType}:${today}`;
      
      let currentUsage = 0;
      
      // Try to get current usage from KV first
      if (this.kv) {
        try {
          const kvUsage = await this.kv.get(key);
          if (kvUsage) {
            currentUsage = parseInt(kvUsage, 10);
          }
        } catch (kvError) {
          console.warn('KV read error:', kvError);
          // Fall back to in-memory map
          currentUsage = this.usageMap.get(key) || 0;
        }
      } else {
        // Get current usage from in-memory map
        currentUsage = this.usageMap.get(key) || 0;
      }
      
      const newUsage = currentUsage + 1;
      
      // Store in KV if available
      if (this.kv) {
        try {
          await this.kv.put(key, newUsage.toString(), { expirationTtl: 86400 }); // Expire after 24 hours
        } catch (kvError) {
          console.warn('KV write error:', kvError);
          // Fall back to in-memory map
          this.usageMap.set(key, newUsage);
        }
      } else {
        // Store in in-memory map
        this.usageMap.set(key, newUsage);
      }
    } catch (error) {
      console.error('Error incrementing usage:', error);
    }
  }

  /**
   * Middleware function to apply quota guard
   */
  async guard(c: Context, next: () => Promise<void>): Promise<Response | undefined> {
    const withinLimits = await this.checkQuota();
    
    if (!withinLimits) {
      return c.json(
        { 
          error: 'Quota exceeded', 
          message: `Daily quota for ${this.resourceType} has been exceeded. Limit: ${this.limit}` 
        }, 
        429
      );
    }
    
    // Increment usage counter
    await this.incrementUsage();
    
    // Continue to next middleware/handler
    await next();
  }
}

// Helper function to create quota guard middleware
export const createQuotaGuard = (config: QuotaGuardConfig) => {
  const quotaGuard = new QuotaGuard(config);
  return async (c: Context, next: () => Promise<void>) => {
    return quotaGuard.guard(c, next);
  };
};