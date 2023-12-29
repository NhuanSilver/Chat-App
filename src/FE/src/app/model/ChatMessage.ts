export interface ChatMessage {
  id : string,
  senderId : string,
  recipientId : string,
  content: string,
  sentAt : Date
}
