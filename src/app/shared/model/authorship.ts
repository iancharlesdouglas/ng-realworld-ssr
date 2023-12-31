import { Author } from "./author";

/**
 * Authorship of an article or comment
 */
export type Authorship = {
  createdAt: Date;
  author: Author;
};
