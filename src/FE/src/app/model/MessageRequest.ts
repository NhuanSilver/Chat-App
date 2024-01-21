
export interface MessageRequest {
  conversationId: string,
  recipientIds: string[],
  content: string,
  contentType: string,
}
