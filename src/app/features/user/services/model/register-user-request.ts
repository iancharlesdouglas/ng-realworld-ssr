/**
 * Register user request
 */
export type RegisterUserRequest = {
	user: {
		username: string;
		email: string;
		password: string;
	};
};
