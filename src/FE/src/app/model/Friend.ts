import {User} from "./User";

export interface Friend {
  id : number,
  owner : User,
  requestTo: User,
  status : string
}
