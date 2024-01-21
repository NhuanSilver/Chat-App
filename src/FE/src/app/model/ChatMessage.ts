import {MESSAGE_TYPE} from "./MESSAGE_TYPE";

export interface ChatMessage {
  id : string,
  conversationId: string
  senderId : string,
  content: string,
  sentAt: Date,
  contentType: string,
  messageType : MESSAGE_TYPE
}
