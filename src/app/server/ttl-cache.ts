import NodeCache from 'node-cache';

/**
 * Function to load a cache entry
 */
export type EntryLoader = () => Promise<unknown>;

/**
 * Cache to optimise serving of initial data requested by Express backend (SSR), with optional preloading
 */
export class TtlCache {
  private cache: NodeCache;

  /**
   * Creates a new cache with the given TTL in seconds
   * @param ttlSeconds TTL in seconds
   * @param preloadEntries Cache entries to preload
   */
  constructor(
    ttlSeconds: number,
    preloadEntries?: Map<string, EntryLoader>
  ) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false,
    });
    if (preloadEntries) {
      this.preloadCache(preloadEntries);
    }
  }

  private preloadCache(preloadEntries: Map<string, EntryLoader>) {
    Array.from(preloadEntries.entries()).forEach(async (entry) => {
      const [key, entryLoader] = entry;
      let value = await entryLoader();
      console.log('Preloading cache entry', key);
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
  async get<T>(key: string, entryLoader: EntryLoader): Promise<T> {
    let value = this.cache.get<T>(key);
    if (!value) {
      value = await entryLoader() as T;
      this.cache.set(key, value);
      this.cache.on('expired', async (key: string) => {
        value = await entryLoader() as T;
        this.cache.set(key, value);
      });
    }
    return value as T;
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
