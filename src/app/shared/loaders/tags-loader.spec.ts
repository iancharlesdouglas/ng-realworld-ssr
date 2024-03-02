import { vi } from "vitest";
import { TagsLoader } from "./tags-loader";
import { TagsApiResponse } from "../model/api/tags-api-response";

describe('TagsLoader', () => {
  it('fetches tags from the remote endpoint', async () => {
    const endpoint = 'https://some-host/tags';
    const tags = ['lorem', 'ipsum'];
    const tagsApiResponse: TagsApiResponse = { tags };
    global.fetch = vi.fn().mockResolvedValue({ok: true, json: async () => tagsApiResponse});

    const loader = new TagsLoader();
    const tagsResponse = await loader.load(endpoint) as TagsApiResponse;

    expect(tagsResponse.tags).toEqual(tags);
  });

  it('matches the tags API', () => {
    const loader = new TagsLoader();

    let matches = loader.matches('/api/tags');

    expect(matches).toBeTruthy();

    matches = loader.matches('/api/v2/tags');

    expect(matches).toBeFalsy();
  });
});
