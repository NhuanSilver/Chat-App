import {Component, OnInit} from '@angular/core';
import {RoomComponent} from "../room/room.component";
import {User} from "../../model/User";
import {CommonModule} from "@angular/common";
import {UserService} from "../../service/user.service";
import {filter, map} from "rxjs";
import {ChatService} from "../../service/chat.service";
import {Conversation} from "../../model/Conversation";

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
export class ChatRoomsComponent implements OnInit{
  conversations : Conversation[] = []
  constructor(private userService : UserService,
              private chatService : ChatService) {

  }
  ngOnInit(): void {
    this.chatService.getAllConversations().subscribe( resp => {
      this.conversations = resp
    })
  }

}
