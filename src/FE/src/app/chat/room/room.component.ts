import {Component, Input, OnInit} from '@angular/core';
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
export class RoomComponent extends BaseComponent implements OnInit{
  @Input() conversation !: Conversation
  protected readonly STATUS = STATUS;
  members : User[] = [];
  latestMessage !: ChatMessage
  constructor(private chatService : ChatService,
              private userService : UserService) {
    super();
  }
  ngOnInit(): void {
    this.members = this.conversation.members.filter(
      member => this.userService.getCurrentUser().username !== member.username
    )
    const userSub = this.chatService.getUser$().subscribe( user => {
      if (user) {
        const member =  this.members.find(m => m.username === user.username);
        if (member) member.status = user.status;
      }
    })

    const latestSub = this.chatService.getConversationMessages(this.conversation.id).subscribe(mesages => {
      this.latestMessage = mesages[mesages.length - 1]
    })

    const newMessageSub = this.chatService.getMessages$().subscribe( value => {
        if (value && value.conversationId === this.conversation.id) {
          this.latestMessage = value
        }
      })

    this.subscriptions.push(newMessageSub)
    this.subscriptions.push(userSub);
    this.subscriptions.push(latestSub)
  }

  setConversation() {
    this.chatService.setConversation(this.conversation);
    this.userService.setRecipients(this.conversation.members);
  }
  getConversation$(){
    return this.chatService.conversation$
  }

}
