import { Article } from './article';

/**
 * Articles list API response
 */
export type ArticlesApiResponse = {
  articles: Article[];
  articlesCount: number;
};
