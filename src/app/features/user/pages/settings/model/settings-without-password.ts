import { User } from "../../../../../shared/model/user";

/**
 * Settings to send to the back end (without password)
 */
export type SettingsWithoutPassword = {
  user: User
};

