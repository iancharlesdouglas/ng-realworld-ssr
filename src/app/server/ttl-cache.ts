import NodeCache from 'node-cache';
import { CacheLoader } from './cache-loader';

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
    private readonly loaders: CacheLoader[]
    // preloadEntries?: Map<string, CacheLoader>
  ) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false,
    });
    // if (preloadEntries) {
    //   this.preloadCache(preloadEntries);
    // }
  }

  /**
   * Returns a loader that can load for a path
   * @param path Path
   * @returns Loader or undefined if none can load the path
   */
  matches(path: string): CacheLoader | undefined {
    return this.loaders.find(loader => loader.matches(path));
  }

  // private preloadCache(preloadEntries: Map<string, CacheLoader>) {
  //   Array.from(preloadEntries.entries()).forEach(async (entry) => {
  //     const [key, cacheLoader] = entry;
  //     let value = await cacheLoader.load();
  //     console.log('Preloading cache entry', key);
  //     this.cache.set(key, value);
  //     this.cache.on('expired', async (key: string) => {
  //       value = await cacheLoader.load();
  //       this.cache.set(key, value);
  //     });
  //   });
  // }

  /**
   * Retrieves a value from the cache, or the store if it has not been cached
   * @param key Key
   * @param cacheLoader Store retrieval function
   * @returns Value
   */
  async get<T>(key: string, cacheLoader: CacheLoader): Promise<T> {
    let value = this.cache.get<T>(key);
    if (!value) {
      value = await cacheLoader.load(key) as T;
      this.cache.set(key, value);
      this.cache.on('expired', async (key: string) => {
        value = await cacheLoader.load(key) as T;
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
