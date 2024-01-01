import { UserRequest } from "./user-request";

/**
 * Settings to send to the back end (with password)
 */
export type SettingsWithPassword = {
  user: UserRequest & {
    password: string;
  }
};
