import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {ChatMessage} from "../model/ChatMessage";
import {Client} from "@stomp/stompjs";
import {StorageService} from "./storage.service";
import {environment} from "../../environments/environment.development";
import {User} from "../model/User";


@Injectable({
  providedIn: 'root'
})
export class Websocket {
  private stompClient !: Client;
  private api_socket_bast = environment.API_SOCKET_BASE;
  private subject: BehaviorSubject<ChatMessage | User |undefined> =
    new BehaviorSubject<ChatMessage | User | undefined>(undefined);
  constructor(private storageService: StorageService) { }
  connect(){
    this.stompClient = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      onConnect: () => {
        this.subscribe()
        const user = this.storageService.getCurrentUser();
        this.stompClient.publish(
          {
            destination : '/app/chat',
            body: JSON.stringify({
              senderId: "nhuan",
              recipientId: "test",
              content: "Chào"
            })
          }
        )
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
  subscribe(): void {
    if (this.stompClient && this.stompClient.connected) {
      const user = this.storageService.getCurrentUser();
      this.stompClient.subscribe(`/topic/public`, (resp) => {
        console.log(JSON.parse(resp.body));
      });
      this.stompClient.subscribe(`/user/nhuan/queue/messages`, resp => {
        console.log(JSON.parse(resp.body));
      });
    } else {
      console.error("Stomp client is not connected.");
    }
  }


}
