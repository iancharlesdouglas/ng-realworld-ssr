import { User } from "../../../shared/model/user";

/**
 * Settings to send to the back end
 */
export type Settings = {
  user: User & {
    password: string;
  }
};
