import { User } from "./user"

/**
 * Application state
 */
export type State = {
  user?: User;
  page: number;
};

/**
 * Initial state
 */
export const initialState: State = { page: 0 };
