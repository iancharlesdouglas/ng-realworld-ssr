import { Article } from "../../../shared/model/article";
import { Comment } from "../../../shared/model/comment";

/**
 * A comment to delete
 */
export type CommentToDelete = {
  article: Article,
  comment: Comment
};
