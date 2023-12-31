import { Injectable } from '@angular/core';
import {WebsocketService} from "./websocket.service";
import {HttpClient} from "@angular/common/http";
import {ChatMessage} from "../model/ChatMessage";
import {BehaviorSubject} from "rxjs";
import {UserService} from "./user.service";
import {Conversation} from "../model/Conversation";
import {User} from "../model/User";
import {TabService} from "./tab.service";
import {TAB} from "../model/TAB";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private conversationSubject: BehaviorSubject<Conversation | undefined> =  new BehaviorSubject<Conversation | undefined>(undefined);
  private recipientsSubject : BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  private activeConversationSubject : BehaviorSubject<Conversation | undefined> = new BehaviorSubject<Conversation | undefined>(undefined);
  constructor(private websocketService : WebsocketService,
              private tabService : TabService,
              private http: HttpClient,
              private userService : UserService) { }

  sendMessage(message: {conversationId : string, recipientIds: string[], content: string }){
    this.websocketService.sendMessage(message)
  }
  getConversationMessages(conversationId : string, usernames : Set<string>) {
    return this.http.get<ChatMessage[]>(`http://localhost:8080/api/messages/conversations/${conversationId}/${[...usernames]}`);
  }
  getConversationByUsernames(sender: string, recipient: string) {
    return this.http.get<Conversation>(`http://localhost:8080/api/conversations/private/${sender}/${recipient}`);
  }

  getConversationById(id : string) {
    return this.http.get<Conversation>(`http://localhost:8080/api/conversations/${id}`);
  }

  getAllConversations() {
    return  this.http.get<Conversation[]>(`http://localhost:8080/api/conversations/users/${this.userService.getCurrentUser().username}`)
  }
  getMessage$() {
    return this.websocketService.getMessage$();
  }
  getUser$() {
    return this.websocketService.getUser$();
  }
  getConversation$() {
    return this.conversationSubject.asObservable();
  }

  getActiveConversation$() {
    return this.activeConversationSubject.asObservable()
  }
  getRecipients$() {
    return this.recipientsSubject?.asObservable()
  }

  setRecipients(members: User[]) {
    this.recipientsSubject.next(members);
  }

  setConversation(conversation : Conversation | undefined) {
    this.conversationSubject.next(conversation)
  }

  setActiveConversation(conversation : Conversation | undefined) {
    this.activeConversationSubject.next(conversation);
  }

  setMember(user : User) {
    return  this.getConversationByUsernames(this.userService.getCurrentUser().username, user.username)
      .subscribe({
        next:
          cvs => {
            if (cvs) {
              this.setConversation(cvs)
              this.setActiveConversation(cvs)
            } else {
              this.setRecipients([user])
              this.setConversation(undefined)
            }
            this.tabService.setMainTabSubject(TAB.CHAT)
          },

        error: _ => {
          this.setRecipients([user])
          this.setConversation(undefined)
        }
      })
  }

}
