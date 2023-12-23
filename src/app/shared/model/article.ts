import { Authorship } from './authorshsip';

/**
 * An article
 */
export type Article = Authorship & {
  slug: string;
  title: string;
  description: string;
  body: string | string[];
  tagList: string[];
  updatedAt: Date;
  favorited: boolean;
  favoritesCount: number;
};
