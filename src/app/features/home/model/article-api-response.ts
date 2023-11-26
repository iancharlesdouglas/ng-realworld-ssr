import { Article } from './article';

/**
 * Articles API response
 */
export type ArticleApiResponse = {
  articles: Article[];
  articlesCount: number;
};
