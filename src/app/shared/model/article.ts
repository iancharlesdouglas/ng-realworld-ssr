import { Authorship } from './authorship';
import { CreateEditArticle } from './create-edit-article';

/**
 * An article
 */
export type Article = CreateEditArticle & Authorship & {
  updatedAt: Date;
  favorited: boolean;
  favoritesCount: number;
};
