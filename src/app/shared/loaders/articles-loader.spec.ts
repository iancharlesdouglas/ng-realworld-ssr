import { vi } from "vitest";
import { ArticlesLoader } from "./articles-loader";
import { Article } from "../model/article";
import { ArticlesApiResponse } from "../model/api/articles-api-response";

describe('ArticlesLoader', () => {
  it('fetches an article from the remote endpoint', async () => {
    const query = 'offset=100&limit=20';
    const endpoint = `https://some-host/articles?${query}`;
    const article: Article = {
      slug: '123',
      title: 'Lorem Ipsum',
      description: 'Lorem ipsum tacitus atsale',
      body: 'Lorem ipsum tamantes tacistus ipto decitus maxi.',
      tagList: [],
      author: {
        username: 'joebloggs25',
        following: false
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      favorited: false,
      favoritesCount: 100
    };
    const articlesApiResponse: ArticlesApiResponse = {articles: [article], articlesCount: 1};
      global.fetch = vi.fn().mockResolvedValue({ok: true, json: async () => articlesApiResponse});

    const loader = new ArticlesLoader();
    const articleResponse = await loader.load(endpoint) as ArticlesApiResponse;

    expect(articleResponse.articles[0]).toEqual(article);
  });

  it('only caches requests that have an offset and a limit query parameter', () => {
    const cacheableQuery = 'offset=100&limit=20';
    const uncacheableQuery = `${cacheableQuery}&tag=ipsum`;
    const host = 'https://some-host/articles';
    const loader = new ArticlesLoader();

    let cacheable = loader.cacheable(`${host}?${cacheableQuery}`);
    expect(cacheable).toBeTruthy();

    cacheable = loader.cacheable(`${host}?${uncacheableQuery}`);
    expect(cacheable).toBeFalsy();
  });

  it('matches the articles API', () => {
    const loader = new ArticlesLoader();

    let matches = loader.matches('/api/articles');

    expect(matches).toBeTruthy();

    matches = loader.matches('/api/v2/articles');

    expect(matches).toBeFalsy();
  });
});
