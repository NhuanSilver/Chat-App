import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {ChatMessage} from "../model/ChatMessage";
import {Client} from "@stomp/stompjs";
import {User} from "../model/User";
import {UserService} from "./user.service";
import {Friend} from "../model/Friend";
import {MessageRequest} from "../model/MessageRequest";


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  public stompClient !: Client;
  private currentUser = this.userService.getCurrentUser();
  private messageSubject = new Subject<ChatMessage>();
  private userSubject = new Subject<User>();
  private friendSubject = new Subject<Friend>()

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
      },
      maxWebSocketChunkSize : 1024 * 1024 * 10,
    });

    this.stompClient.activate()
  }

  getMessage$(): Observable<ChatMessage> {
    return this.messageSubject.asObservable();
  }
  getUser$(): Observable< User | undefined> {
    return this.userSubject.asObservable();
  }

  sendMessage(message: MessageRequest) {
    if (this.stompClient && this.stompClient.connected) {
      this.publishMessage(message);
    }
  }

  publishMessage(message: MessageRequest): void {
    this.stompClient.publish(
      {
        destination: '/app/chat',
        body: JSON.stringify({
          conversationId: message.conversationId,
          senderId: this.userService.getCurrentUser().username,
          recipientIds: message.recipientIds,
          content: message.content,
          type: message.type
        }),
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
