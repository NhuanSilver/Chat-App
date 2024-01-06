import {User} from "./User";

export interface Friend {
  owner : User,
  requestTo: User,
  status : string
}
