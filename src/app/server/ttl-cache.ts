import NodeCache from 'node-cache';

/**
 * Function to load a cache entry
 */
export type EntryLoader<T> = () => Promise<T>;

/**
 * Cache to optimise serving of initial data requested by Express backend (SSR), with optional preloading
 */
export class TtlCache<T> {
  private cache: NodeCache;

  /**
   * Creates a new cache with the given TTL in seconds
   * @param ttlSeconds TTL in seconds
   * @param preloadEntries Cache entries to preload
   */
  constructor(
    ttlSeconds: number,
    preloadEntries?: Map<string, EntryLoader<T>>
  ) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false,
    });
    if (preloadEntries) {
      console.log('Preloading cache...');
      this.preloadCache(preloadEntries);
    }
  }

  private preloadCache(preloadEntries: Map<string, EntryLoader<T>>) {
    Array.from(preloadEntries.entries()).forEach(async (entry) => {
      const [key, entryLoader] = entry;
      let value = await entryLoader();
      this.cache.set(key, value);
      this.cache.on('expired', async (key: string) => {
        value = await entryLoader();
        this.cache.set(key, value);
      });
    });
  }

  /**
   * Retrieves a value from the cache, or the store if it has not been cached
   * @param key Key
   * @param entryLoader Store retrieval function
   * @returns Value
   */
  async get(key: string, entryLoader: EntryLoader<T>): Promise<T> {
    let value = this.cache.get<T>(key);
    console.log('Cache hit - value retrieved from cache');
    if (!value) {
      console.log('Cache miss - value being loaded from remote source');
      value = await entryLoader();
      this.cache.set(key, value);
      this.cache.on('expired', async (key: string) => {
        value = await entryLoader();
        this.cache.set(key, value);
      });
    }
    return value;
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
