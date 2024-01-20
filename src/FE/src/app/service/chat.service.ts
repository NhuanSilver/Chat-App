import { Injectable } from '@angular/core';
import {WebsocketService} from "./websocket.service";
import {HttpClient} from "@angular/common/http";
import {ChatMessage} from "../model/ChatMessage";
import {BehaviorSubject, Subject} from "rxjs";
import {UserService} from "./user.service";
import {Conversation} from "../model/Conversation";
import {User} from "../model/User";
import {TabService} from "./tab.service";
import {TAB} from "../model/TAB";
import {MessageRequest} from "../model/MessageRequest";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private conversationSubject = new Subject<Conversation | undefined>();
  private recipientsSubject = new BehaviorSubject<User[]>([]);
  private activeConversationSubject : BehaviorSubject<Conversation | undefined> = new BehaviorSubject<Conversation | undefined>(undefined);
  private newConversation = new Subject<Conversation>();
  constructor(private websocketService : WebsocketService,
              private tabService : TabService,
              private http: HttpClient,
              private userService : UserService) { }

  sendMessage(message: MessageRequest){
    this.websocketService.sendMessage(message)
  }
  getConversationMessages(conversationId : string, username : string) {
    return this.http.get<ChatMessage[]>(`http://localhost:8080/api/messages/conversations/${conversationId}/${username}`);
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

  createPrivateChat(name: string, recipient: string) {
    const request = {
      name : name,
      usernames : [this.userService.getCurrentUser().username, recipient],
      group: false
    }

    return this.http.post<Conversation>('http://localhost:8080/api/conversations/private', request )
  }

  createGroupChat(name: string, recipients : string[]) {
    const request = {
      name: name,
      usernames: recipients,
      group: true
    }
    return this.http.post<Conversation>('http://localhost:8080/api/conversations/group', request )
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
    return this.recipientsSubject.asObservable()
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
  getNewConversation$() {
    return this.newConversation.asObservable();
  }
  setNewConversation(conversation : Conversation) {
    this.newConversation.next(conversation);
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
