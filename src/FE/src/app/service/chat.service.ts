import { Injectable } from '@angular/core';
import {WebsocketService} from "./websocket.service";
import {HttpClient} from "@angular/common/http";
import {ChatMessage} from "../model/ChatMessage";
import {BehaviorSubject} from "rxjs";
import {UserService} from "./user.service";
import {Conversation} from "../model/Conversation";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private conversationSubject: BehaviorSubject<Conversation | undefined> =  new BehaviorSubject<Conversation | undefined>(undefined);
  conversation$ = this.conversationSubject.asObservable();

  constructor(private websocketService : WebsocketService,
              private http: HttpClient,
              private userService : UserService) { }

  sendMessage(message: {conversationId : string, recipientIds: string[], content: string }){
    this.websocketService.sendMessage(message)
  }
  getConversationMessages(conversationId : string) {
    return this.http.get<ChatMessage[]>(`http://localhost:8080/conversations/${conversationId}/messages`)
  }

  setConversation(conversation : Conversation) {
    this.conversationSubject.next(conversation)
  }
  getAllConversations() {
    return  this.http.get<Conversation[]>(`http://localhost:8080/conversations/user/${this.userService.getCurrentUser().username}`)
  }


}
