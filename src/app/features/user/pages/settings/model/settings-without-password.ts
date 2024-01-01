import { UserRequest } from "./user-request";

/**
 * Settings to send to the back end (without password)
 */
export type SettingsWithoutPassword = {
  user: UserRequest
};

