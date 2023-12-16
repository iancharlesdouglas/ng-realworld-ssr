/**
 * Loads resources for a cache entry
 */
export abstract class CacheLoader {
  /**
   * Loads the cache resource
   * @param key Key to load
   */
  async load(key: string): Promise<unknown> {
    return null;
  }

  /**
   * Whether a path matches the loader service path
   * @param path Path
   * @returns True if can be loaded
   */
  matches(path: string): boolean {
    return true;
  }

  /**
   * Whether a path is cacheable
   * @param path Path
   * @returns True if can be cached
   */
  cacheable(path: string): boolean {
    return true;
  }
}
