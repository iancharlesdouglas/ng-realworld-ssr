import { environment } from "../../../environments/environment";
import { CacheLoader } from "../../server/cache-loader";

/**
 * Loader that loads articles from the remote service and determines whethe they can be cached
 */
export class ArticlesLoader extends CacheLoader {
  /**
   * Loads articles
   * @param key Path to load incl. query string
   * @returns Articles payload
   */
  override async load(key: string): Promise<unknown> {
    try {
      const queryString = key.split('?')[1];
      const { remoteApiHost } = environment;
      const response = await fetch(`${remoteApiHost}/api/articles?${queryString}`);
      if (response.ok) {
        const articlesPayload = await response.json();
        return articlesPayload;
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error occurred in articles-loader load for key ${key}`, error);
      return null;
    }
  }

  /**
   * Whether a path matches this loader
   * @param path Path
   * @returns True if cacheable
   */
  override matches(path: string): boolean {
    return path.startsWith('/api/articles');
  }

  /**
   * Whether a path is cacheable
   * @param path Path
   * @returns True if can be cached
   */
  override cacheable(path: string): boolean {
    const pathParts = path?.split('?');
    if (pathParts.length > 1) {
      const queryParameters = new URLSearchParams(pathParts[1]);
      return queryParameters.has('offset') && queryParameters.has('limit') && queryParameters.size === 2;
    }
    return false;
  }
}
