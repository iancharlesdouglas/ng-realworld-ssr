import { Comment } from '../comment';

/**
 * Comments returned from the API
 */
export type CommentsApiResponse = {
	comments: Comment[];
};
