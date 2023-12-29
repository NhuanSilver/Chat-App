import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../model/User";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class UserService {
  constructor(private http: HttpClient) {

  }
  public login(username: string, password: string): Observable<User> {
    return  this.http.post<User>('http://localhost:8080/api/login', {username: username, password : password})
  }
}
