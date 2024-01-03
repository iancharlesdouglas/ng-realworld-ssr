import { Feed } from "./feed";
import { User } from "./user"

/**
 * Application state
 */
export type State = {
  user?: User;
  page: number;
  homePageFeed?: Feed;
  profilePageFeed?: Feed;
  tag: string;
};

/**
 * Initial state
 */
export const initialState: State = { page: 0, homePageFeed: Feed.global, tag: '' };
