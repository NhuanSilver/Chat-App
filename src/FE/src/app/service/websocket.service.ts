import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {ChatMessage} from "../model/ChatMessage";
import {Client} from "@stomp/stompjs";
import {User} from "../model/User";
import {UserService} from "./user.service";
import {Friend} from "../model/Friend";


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private stompClient !: Client;
  private currentUser = this.userService.getCurrentUser();
  private messageSubject: BehaviorSubject<ChatMessage | undefined> = new BehaviorSubject<ChatMessage | undefined>(undefined);
  private userSubject : BehaviorSubject<User | undefined> = new BehaviorSubject<User | undefined>(undefined);
  private friendSubject: BehaviorSubject<Friend | undefined> = new BehaviorSubject<Friend | undefined>(undefined);

  constructor(private userService: UserService) {
  }

  connect() {
    this.stompClient = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      connectHeaders: {
        Authorization: 'Bearer ' + this.currentUser.token,
      },
      onConnect: () => {
        this.subscribe()
        this.stompClient.publish({
          destination: '/app/user.Connect',
          body: JSON.stringify(this.userService.getCurrentUser())
        })
      },
      onStompError: (frame) => {
      }
    });
    this.stompClient.activate()
  }

  getMessage$(): Observable<ChatMessage | undefined> {
    return this.messageSubject.asObservable();
  }
  getUser$(): Observable< User | undefined> {
    return this.userSubject.asObservable();
  }

  sendMessage(message: { conversationId: string, recipientIds: string[], content: string }) {
    if (this.stompClient && this.stompClient.connected) {
      this.publishMessage(message);
    }
  }

  publishMessage(message: { conversationId: string, recipientIds: string[], content: string }): void {
    this.stompClient.publish(
      {
        destination: '/app/chat',
        body: JSON.stringify({
          conversationId: message.conversationId,
          senderId: this.userService.getCurrentUser().username,
          recipientIds: message.recipientIds,
          content: message.content
        })
      }
    )
  }

  getFriend$() {
    return this.friendSubject.asObservable();
  }

  subscribe(): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.subscribe(`/topic/public`, (resp) => {
        this.userSubject.next(JSON.parse(resp.body))
      });
      this.stompClient.subscribe(`/user/${this.currentUser.username}/queue/messages`, resp => {
        this.messageSubject.next(JSON.parse(resp.body))
      });

      this.stompClient.subscribe(`/user/${this.currentUser.username}/queue/friends`, resp => {
        this.friendSubject.next(JSON.parse(resp.body))
      })

    } else {
      console.error("Stomp client is not connected.");
    }
  }


  disconnect() {
    this.stompClient.publish({
      destination: '/app/user.Disconnect',
      body: JSON.stringify(this.userService.getCurrentUser())
    })
    this.stompClient.deactivate()
  }

  addFriend(username: string) {
    this.stompClient.publish({
      destination: '/app/user.AddFriend',
      body: JSON.stringify({
        owner: this.currentUser.username,
        requestTo: username
      })
    })

  }
}
