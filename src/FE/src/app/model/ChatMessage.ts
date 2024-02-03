import {MESSAGE_TYPE} from "./MESSAGE_TYPE";
import {User} from "./User";

export interface ChatMessage {
  id : string,
  conversationId: string
  sender : User,
  content: string,
  sentAt: Date,
  contentType: string,
  messageType : MESSAGE_TYPE
}
