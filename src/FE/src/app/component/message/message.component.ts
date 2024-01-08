import {Component,  Input} from '@angular/core';
import {ChatMessage} from "../../model/ChatMessage";
import {NgClass} from "@angular/common";
import {UserService} from "../../service/user.service";
import {User} from "../../model/User";
import {Conversation} from "../../model/Conversation";

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {
  @Input() message !: ChatMessage
  @Input() conversation :Conversation | undefined
  constructor(private userService : UserService) {
  }
  getCurrentUser() : User {
   return this.userService.getCurrentUser()
  }
  getAvatarUrl() {
   return  this.conversation?.members.find(member => member.username === this.message.senderId)?.avatarUrl
  }
}
