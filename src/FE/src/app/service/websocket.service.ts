import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {ChatMessage} from "../model/ChatMessage";
import {Client} from "@stomp/stompjs";
import {User} from "../model/User";
import {UserService} from "./user.service";


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private stompClient !: Client;
  private subject: BehaviorSubject<ChatMessage | User |undefined> =
    new BehaviorSubject<ChatMessage | User | undefined>(undefined);
  constructor(private userService : UserService) { }
  connect(){
    this.stompClient = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      onConnect: () => {
        this.subscribe()
      },
      onStompError: () => {
        console.log("that bai")
      }
    });
    this.stompClient.activate()
  }
  getMessage(): Observable<ChatMessage | User |undefined> {
    return this.subject.asObservable();
  }
  sendMessage(message: {conversationId : string, recipientIds:  string[], content: string }) {
    if (this.stompClient && this.stompClient.connected) {
      this.publishMessage(message)
    } else {
      this.stompClient = new Client({
        brokerURL: 'ws://localhost:8080/ws',
        onConnect: () => {
          this.subscribe()
          this.publishMessage(message)
        },
        onStompError: () => {
          console.log("that bai")
        }
      });
      this.stompClient.activate()
    }
  }
  publishMessage(message: {conversationId : string, recipientIds: string[], content: string }): void {
    this.stompClient.publish(
      {
        destination : '/app/chat',
        body: JSON.stringify({
          conversationId : message.conversationId,
          senderId: this.userService.getCurrentUser().username,
          recipientIds: message.recipientIds,
          content: message.content
        })
      }
    )
  }
  subscribe(): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.subscribe(`/topic/public`, (resp) => {
        console.log(JSON.parse(resp.body));
      });
      this.stompClient.subscribe(`/user/${this.userService.getCurrentUser().username}/queue/messages`, resp => {
        console.log(JSON.parse(resp.body));
      });
    } else {
      console.error("Stomp client is not connected.");
    }
  }


}
