import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../model/User";
import {STATUS} from "../../model/STATUS";
import {CommonModule} from "@angular/common";
import {ChatService} from "../../service/chat.service";
import {UserService} from "../../service/user.service";
import {Conversation} from "../../model/Conversation";

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss'
})
export class RoomComponent implements OnInit{
  @Input() conversation !: Conversation
  protected readonly STATUS = STATUS;
  isActive: boolean= false;
  members : User[] = []

  constructor(private chatService : ChatService,
              private userService : UserService) {
  }
  ngOnInit(): void {
    this.members = this.conversation.members.filter(
      member => this.userService.getCurrentUser().username !== member.username
    )
  }

  setConversation() {
    this.chatService.setConversation(this.conversation)
  }
}
