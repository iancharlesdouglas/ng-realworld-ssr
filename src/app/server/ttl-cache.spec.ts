import { vi } from "vitest";
import { CacheLoader } from "./cache-loader";
import { TtlCache } from "./ttl-cache";

const cacheKey = 'a_key';
const cacheValue = 'a_value';

class MockCacheLoader extends CacheLoader {
}

describe('TtlCache', () => {
  it('calls cache loader when a value is first sought but not thereafter', async() => {
    const cache = new TtlCache(3_600, []);
    const loader = new MockCacheLoader();
    let counter = 0;
    loader.load = vi.fn().mockResolvedValue(`${cacheValue}${++counter}`);

    let value = await cache.get(cacheKey, loader);
    expect(loader.load).toHaveBeenCalled();
    expect(value).toEqual('a_value1');

    value = await cache.get(cacheKey, loader);
    expect(value).toEqual('a_value1');
  });
});
