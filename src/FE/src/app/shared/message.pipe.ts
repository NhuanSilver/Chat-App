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
  transform(message: ChatMessage): string {
    switch(message.messageType) {
      case MESSAGE_TYPE.RECALL: {
        if (this.userService.isCurrentUser(message.sender.username)) {
          return "Bạn đã thu hồi tin nhắn"
        } else {
          return `${message.sender.fullName} đã thu hồi tin nhắn`
        }
      }
      case MESSAGE_TYPE.DELETE: {
        return message.content
      }
      default: {
        return message.content
      }
    }
  }

}
