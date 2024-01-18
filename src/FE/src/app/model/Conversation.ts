import {User} from "./User";
import {ChatMessage} from "./ChatMessage";

export interface Conversation {
  id: string,
  name: string,
  latestMessage : ChatMessage,
  members : User[],
  isActive: boolean,
  group: boolean
  createAt : Date,
  updateAt : Date
}
