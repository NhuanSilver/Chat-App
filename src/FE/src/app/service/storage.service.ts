import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {User} from "../model/User";

@Injectable({
  providedIn: 'root'
})
export class StorageService {
   sessionStorage = window.sessionStorage;
   userKey = environment.USER_KEY;
  constructor() { }

  getCurrentUser(): User {
    const userJson = this.sessionStorage.getItem(this.userKey) || '';
    return userJson != '' ? JSON.parse(userJson) : undefined;
  }
  saveUser(user : User) {
    this.sessionStorage.setItem(this.userKey, JSON.stringify(user));
  }
  removeUser() {
    this.sessionStorage.removeItem(this.userKey)
  }
}
