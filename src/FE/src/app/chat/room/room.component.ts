import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from "../../model/User";
import {STATUS} from "../../model/STATUS";
import {CommonModule} from "@angular/common";
import {ChatService} from "../../service/chat.service";
import {UserService} from "../../service/user.service";
import {Conversation} from "../../model/Conversation";
import {BaseComponent} from "../../BaseComponent";
import {ChatMessage} from "../../model/ChatMessage";

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss'
})
export class RoomComponent extends BaseComponent implements OnInit {
  @Input() conversation !: Conversation
  protected readonly STATUS = STATUS;
  members: User[] = [];
  @Output() sendConversationId = new EventEmitter<ChatMessage>();

  constructor(private chatService: ChatService,
              private userService: UserService) {
    super();
  }

  ngOnInit(): void {
    this.members = this.conversation.members.filter(
      member => {
        return this.userService.getCurrentUser().username !== member.username
      }
    )
    const userSub = this.chatService.getUser$().subscribe(user => {
      if (user) {
        const member = this.members.find(m => m.username === user.username);
        if (member) member.status = user.status;
      }
    })


    const usernames = new Set<string>(this.members.map(m => m.username));
    usernames.add(this.userService.getCurrentUser().username)


    const newMessageSub = this.chatService.getMessage$().subscribe(value => {
      if (value && value.conversationId === this.conversation.id) {
          this.sendConversationIdToParent(value);
        }
    })

    this.subscriptions.push(newMessageSub)
    this.subscriptions.push(userSub);
  }

  setConversation() {
    this.chatService.setConversation(this.conversation);
    this.userService.setRecipients(this.conversation.members);
  }

  getConversation$() {
    return this.chatService.conversation$
  }

  sendConversationIdToParent(newMessage: ChatMessage) {
    this.sendConversationId.emit(newMessage)
  }
}
