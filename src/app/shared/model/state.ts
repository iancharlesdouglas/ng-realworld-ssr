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
};

/**
 * Initial state
 */
export const initialState: State = { page: 0, homePageFeed: { feed: Feed.global } };
