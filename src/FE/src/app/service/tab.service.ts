import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {TAB} from "../model/TAB";

@Injectable({
  providedIn: 'root'
})
export class TabService {
  private tabSubject : BehaviorSubject<string> = new BehaviorSubject<string>(TAB.CHAT);

  constructor() { }

  getTab$() {
    return this.tabSubject.asObservable();
  }
  setTab(tab : string) {
    this.tabSubject.next(tab)
  }
}
