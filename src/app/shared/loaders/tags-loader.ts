import { environment } from "../../../environments/environment";
import { CacheLoader } from "../../server/cache-loader";

/**
 * Loader that loads tags from the remote service
 */
export class TagsLoader extends CacheLoader {
  /**
   * Loads tags
   * @param key Path
   * @returns Tags payload
   */
  override async load(key: string): Promise<unknown> {
    try {
      if (key) {
        const { remoteApiHost } = environment;
        const response = await fetch(`${remoteApiHost}/api/tags`);
        if (response.ok) {
          const tagsPayload = await response.json();
          return tagsPayload;
        } else {
          return null;
        }
      }
    } catch (error) {
      console.error(`Error occurred in tags-loader load for key ${key}`, error);
    }
  return null;
}

  /**
   * Whether a path matches this loader
   * @param path Path
   * @returns True if cacheable
   */
  override matches(path: string): boolean {
    return path.startsWith('/api/tags');
  }
}
