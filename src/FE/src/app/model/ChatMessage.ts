export interface ChatMessage {
  id : string,
  conversationId: string
  senderId : string,
  content: string,
  sentAt : Date
}
