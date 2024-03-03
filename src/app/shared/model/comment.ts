import { Author } from './author';
import { Authorship } from './authorship';

/**
 * A comment on an article
 */
export type Comment = Authorship & {
	id: number;
	createdAt: Date;
	updatedAt: Date;
	body: string;
	author: Author;
};
