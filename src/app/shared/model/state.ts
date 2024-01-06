import { ActiveFeed, Feed } from "./feed";
import { User } from "./user"

/**
 * Application state
 */
export type State = {
  user?: User;
  page: number;
  homePageFeed?: ActiveFeed;
  profilePageFeed?: Feed;
  profilePage: number;
};

/**
 * Initial state
 */
export const initialState: State = { page: 0, homePageFeed: { feed: Feed.global }, profilePageFeed: Feed.authored, profilePage: 0 };
