import {STATUS} from "./STATUS";

export interface User {
  username : string,
  fullName : string,
  token: string,
  avatarUrl: string,
  status : STATUS,
}
