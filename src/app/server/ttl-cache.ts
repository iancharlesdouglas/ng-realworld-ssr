import NodeCache from 'node-cache';

/**
 * Cache to optimise serving of initial data requested by Express backend (SSR)
 */
export class TtlCache<T> {
  private cache: NodeCache;

  /**
   * Creates a new cache with the given TTL in seconds
   * @param ttlSeconds TTL in seconds
   */
  constructor(ttlSeconds: number) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false,
    });
  }

  /**
   * Retrieves a value from the cache, or the store if it has not been cached
   * @param key Key
   * @param storeFunction Store retrieval function
   * @returns Value
   */
  async get(key: string, storeFunction: () => Promise<T>): Promise<T> {
    const value = this.cache.get<T>(key);
    if (value) {
      console.log('cache: hit for', key);
      return value;
    }
    const storeValue = await storeFunction();
    this.cache.set(key, storeValue);
    return storeValue;
  }

  /**
   * Deletes key/s from the cache
   * @param keys Key/s to delete
   * @returns Number of items deleted
   */
  delete(keys: string | string[]): number {
    return this.cache.del(keys);
  }

  /**
   * Flushes the cache
   */
  flush(): void {
    this.cache.flushAll();
  }
}
