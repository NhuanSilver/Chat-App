import {User} from "./User";

export interface Conversation {
  id: string,
  name: string,
  members : User[]
}
