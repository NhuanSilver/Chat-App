import {Component, Input, OnInit} from '@angular/core';
import {ChatMessage} from "../../model/ChatMessage";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {UserService} from "../../service/user.service";
import {User} from "../../model/User";
import {Conversation} from "../../model/Conversation";

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    NgForOf
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent implements OnInit {
  @Input() message !: ChatMessage
  @Input() conversation: Conversation | undefined
  imgToDisplay: string [] = [];

  constructor(private userService: UserService) {

  }

  ngOnInit(): void {
    if (this.message.type === "IMG") {
      this.imgToDisplay = this.JSON.parse(this.message.content)
    }
  }

  getCurrentUser(): User {

    return this.userService.getCurrentUser()
  }

  getAvatarUrl() {
    return this.conversation?.members.find(member => member.username === this.message.senderId)?.avatarUrl
  }

  protected readonly JSON = JSON;
}
