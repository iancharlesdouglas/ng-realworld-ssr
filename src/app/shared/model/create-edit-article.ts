/**
 * Fields for creating and editing an article
 */
export type CreateEditArticle = {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
};
