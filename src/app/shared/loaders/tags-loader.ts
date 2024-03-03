import { environment } from '../../../environments/environment';
import { CacheLoader } from '../../server/cache-loader';

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
		if (key) {
			const { remoteApiHost } = environment;
			const response = await fetch(`${remoteApiHost}/api/tags`);
			if (response.ok) {
				const tagsPayload = await response.json();
				return tagsPayload;
			}
		}
		return undefined;
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
