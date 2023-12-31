import { User } from "../../../../../shared/model/user";

/**
 * Settings to send to the back end (with password)
 */
export type SettingsWithPassword = {
  user: User & {
    password: string;
  }
};
