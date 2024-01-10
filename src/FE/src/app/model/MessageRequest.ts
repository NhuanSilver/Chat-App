
export interface MessageRequest {
  conversationId: string,
  recipientIds: string[],
  content: string,
  type: string,
}
