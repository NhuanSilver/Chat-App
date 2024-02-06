import {Pipe, PipeTransform} from '@angular/core';
import {ChatMessage} from "../model/ChatMessage";
import {MESSAGE_TYPE} from "../model/MESSAGE_TYPE";
import {UserService} from "../service/user.service";

@Pipe({
  name: 'message',
  standalone: true
})
export class MessagePipe implements PipeTransform {
  constructor(private userService : UserService) {
  }
  transform(message: ChatMessage, chatMessage ?: ChatMessage[], sentAt?: boolean): string {
    if (chatMessage) {
      if (sentAt) return this.greaterThanPrevious5Minutes(message, chatMessage) + "";

      return this.getPositionOfMessage(message, chatMessage)

    } else {
      switch(message.messageType) {
        case MESSAGE_TYPE.RECALL: {
          if (this.userService.isCurrentUser(message.sender.username)) {
            return "Bạn đã thu hồi tin nhắn"
          } else {
            return `${message.sender.fullName} đã thu hồi tin nhắn`
          }
        }
        case MESSAGE_TYPE.DELETE: {
          return message.content;
        }
        case MESSAGE_TYPE.CREATE: {
          return message.content;
        }
        default: {
          return "";
        }
      }
    }

  }
  getPositionOfMessage(message: ChatMessage, chatMessages : ChatMessage[]): string {
    const index = chatMessages.indexOf(message);
    const samePrevSender = message.sender.username === chatMessages[index - 1]?.sender.username;
    const sameNextSender = message.sender.username === chatMessages[index + 1]?.sender.username;


    if (index === 0 && (!sameNextSender || this.greaterThanNext5Minutes(message, chatMessages))) return 'fl';
    if (index === 0) return 'f';
    if (index > 0) {

      if (
        !sameNextSender && !samePrevSender
        || !samePrevSender && this.greaterThanNext5Minutes(message, chatMessages)
        || !sameNextSender && this.greaterThanPrevious5Minutes(message, chatMessages)
        || this.greaterThanPrevious5Minutes(message, chatMessages) && this.greaterThanNext5Minutes(message, chatMessages)

      ) return "fl";

      if (!sameNextSender || this.greaterThanNext5Minutes(message, chatMessages)) return 'l';
      if (!samePrevSender && sameNextSender || this.greaterThanPrevious5Minutes(message, chatMessages)) return 'f'
    }
    return 'middle';

  }

  greaterThanPrevious5Minutes(message: ChatMessage, chatMessages : ChatMessage[]) {
    const index = chatMessages.indexOf(message);
    if (index === 0) return true;
    return this.minusMinutes(message.sentAt, chatMessages[index - 1].sentAt) >= 5;
  }

  greaterThanNext5Minutes(message: ChatMessage, chatMessages : ChatMessage[]) {
    const index = chatMessages.indexOf(message);
    return this.minusMinutes(chatMessages[index + 1].sentAt, message.sentAt) >= 5;
  }

  minusMinutes(a: Date, b: Date) {
    return Math.floor(((new Date(a).getTime() - new Date(b).getTime()) / 1000) / 60)
  }

}
