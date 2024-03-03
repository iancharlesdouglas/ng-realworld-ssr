/**
 * An empty article
 */
export const EMPTY_ARTICLE = {
	slug: '',
	title: '',
	description: '',
	body: '',
	tagList: [],
	createdAt: new Date(),
	updatedAt: new Date(),
	author: {
		username: '',
		following: false,
	},
	favorited: false,
	favoritesCount: 0,
};
