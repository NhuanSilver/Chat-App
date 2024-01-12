import {Component, Input, OnInit} from '@angular/core';
import {ChatMessage} from "../../model/ChatMessage";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {UserService} from "../../service/user.service";
import {User} from "../../model/User";
import {Conversation} from "../../model/Conversation";
import {MyDatePipe} from "../../shared/my-date.pipe";

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    NgForOf,
    DatePipe,
    MyDatePipe
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent implements OnInit {
  @Input() message !: ChatMessage
  @Input() displaySentAt !: boolean
  @Input() position !: string
  @Input() conversation: Conversation | undefined
  imgToDisplay: string [] = [];

  constructor(private userService: UserService) {

  }

  ngOnInit(): void {
    console.log(this.position)
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
