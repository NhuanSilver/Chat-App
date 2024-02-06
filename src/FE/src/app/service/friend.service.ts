import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserService} from "./user.service";
import {Friend} from "../model/Friend";
import {WebsocketService} from "./websocket.service";
import {environment} from "../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class FriendService {

  currentUser = this.userService.getCurrentUser();
  private API_BASE = environment.API_BASE;

  constructor(private http: HttpClient,
              private webSocketService : WebsocketService,
              private userService: UserService
              ) { }


  getAllFriend() {
    return this.http.get<Friend[]>(`${this.API_BASE}/friends/users/${this.currentUser.username}`)
  }
  addFriend(username: string) {
    this.webSocketService.addFriend(username);
  }
  deleteFriend(id: number) {
    return this.http.delete(`${this.API_BASE}/friends/${id}`);
  }
  getAddFriendRequest() {
    return this.http.get<Friend[]>(`${this.API_BASE}/friends/requests/users/${this.currentUser.username}`)
  }
  getFriend$() {
    return this.webSocketService.getFriend$();
  }
  checkFriend(username : string) {
    return this.http.get<boolean>(`${this.API_BASE}/friends/users/${this.currentUser.username}/isFriend/${username}`)
  }


}
