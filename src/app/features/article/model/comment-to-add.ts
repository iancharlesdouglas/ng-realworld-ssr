import { Article } from '../../../shared/model/article';

/**
 * Event payload for adding an article comment
 */
export type CommentToAdd = {
	article: Article;
	comment: string;
};
