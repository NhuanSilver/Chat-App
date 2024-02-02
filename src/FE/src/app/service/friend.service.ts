import { Injectable } from '@angular/core';
import {User} from "../model/User";
import {HttpClient} from "@angular/common/http";
import {UserService} from "./user.service";
import {Friend} from "../model/Friend";
import {WebsocketService} from "./websocket.service";

@Injectable({
  providedIn: 'root'
})
export class FriendService {

  currentUser = this.userService.getCurrentUser();

  constructor(private http: HttpClient,
              private webSocketService : WebsocketService,
              private userService: UserService
              ) { }


  getAllFriend() {
    return this.http.get<Friend[]>(`http://localhost:8080/api/friends/users/${this.currentUser.username}`)
  }
  addFriend(username: string) {
    this.webSocketService.addFriend(username);
  }
  deleteFriend(id: number) {
    return this.http.delete(`http://localhost:8080/api/friends/${id}`);
  }
  getAddFriendRequest() {
    return this.http.get<Friend[]>(`http://localhost:8080/api/friends/requests/users/${this.currentUser.username}`)
  }
  getFriend$() {
    return this.webSocketService.getFriend$();
  }
  checkFriend(username : string) {
    return this.http.get<boolean>(`http://localhost:8080/api/friends/users/${this.currentUser.username}/isFriend/${username}`)
  }


}
