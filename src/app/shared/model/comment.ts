import { Author } from "./author";
import { Authorship } from "./authorship";

/**
 * A comment on an article
 */
export type Comment = Authorship & {
  id: number,
  updatedAt: Date,
  body: string;
  author: Author;
};
