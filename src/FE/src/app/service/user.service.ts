import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../model/User";
import {BehaviorSubject, Observable} from "rxjs";
import {StorageService} from "./storage.service";
import {WebsocketService} from "./websocket.service";
import {Friend} from "../model/Friend";

@Injectable({
  providedIn: 'root'
})

export class UserService {
  constructor(private http: HttpClient,
              private storageService : StorageService) {

  }
  public login(username: string, password: string): Observable<User> {
    return  this.http.post<User>('http://localhost:8080/api/users/login', {username: username, password : password})
  }
  public getAllUsers() {
    return this.http.get<User[]>('http://localhost:8080/api/users')
  }
  isCurrentUser(username : string) : boolean {
    return username === this.getCurrentUser().username;
  }
  getCurrentUser() : User {
    return this.storageService.getCurrentUser()
  }
  searchUserFriendByUsernameOrName(value : string) : Observable<User[]>  {
    return this.http.get<User[]>(`http://localhost:8080/api/users/${this.getCurrentUser().username}/friends/search/${value}`)
  }

  searchUserNotFriendByUsernameOrFullName(value : string) : Observable<User[]> {
    return this.http.get<User[]>(`http://localhost:8080/api/users/${this.getCurrentUser().username}/notFriends/search/${value}`)
  }

  logOut() {
    this.getCurrentUser().status
    this.storageService.removeUser();
  }

  register(fullName: string, username: string, password: string) {
    return  this.http.post<User>('http://localhost:8080/api/users/register', {fullName, username, password} )
  }
}
