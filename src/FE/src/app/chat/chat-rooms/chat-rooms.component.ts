import {Component, OnInit} from '@angular/core';
import {RoomComponent} from "../room/room.component";
import {CommonModule} from "@angular/common";
import {ChatService} from "../../service/chat.service";
import {Conversation} from "../../model/Conversation";
import {BaseComponent} from "../../BaseComponent";
import {map} from "rxjs";
import {ChatMessage} from "../../model/ChatMessage";

@Component({
  selector: 'app-chat-rooms',
  standalone: true,
  imports: [
    CommonModule,
    RoomComponent
  ],
  templateUrl: './chat-rooms.component.html',
  styleUrl: './chat-rooms.component.scss'
})
export class ChatRoomsComponent extends BaseComponent implements OnInit {
  conversations: Conversation[] = []

  constructor(private chatService: ChatService) {
    super();

  }

  ngOnInit(): void {
    this.subscriptions.push(this.chatService.getAllConversations()
      .subscribe(resp => {
        this.conversations =  this.sortConversation(resp)
      }))
  }

  receiveConversationIdFromChild(newMessage: ChatMessage) {
    this.conversations.forEach(cvs => {
      if (cvs.id === newMessage.conversationId) {
        console.log("vào rồi a")
        cvs.latestMessage = newMessage;
        this.conversations = this.sortConversation(this.conversations);
      }
    })
  }
  sortConversation(conversationsToSort : Conversation[]) {
    return  conversationsToSort.sort((a, b) =>  {
      return  new Date(b?.latestMessage?.sentAt)?.getTime() - new Date(a?.latestMessage?.sentAt)?.getTime();
    })
  }

}
