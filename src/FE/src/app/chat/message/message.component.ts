import {Component, Input} from '@angular/core';
import {ChatMessage} from "../../model/ChatMessage";
import {NgClass} from "@angular/common";
import {UserService} from "../../service/user.service";
import {User} from "../../model/User";

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
  constructor(private userService : UserService) {
  }
  getCurrentUser() : User {
   return this.userService.getCurrentUser()
  }
}
