import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../model/User";
import {BehaviorSubject, Observable} from "rxjs";
import {StorageService} from "./storage.service";

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
  getCurrentUser() : User {
    return this.storageService.getCurrentUser()
  }
  searchUserByUsernameOrName(value : string) {
    return this.http.get<User[]>(`http://localhost:8080/api/users/search/${value}`)
  }
}
