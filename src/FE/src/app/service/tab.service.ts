import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {TAB} from "../model/TAB";

@Injectable({
  providedIn: 'root'
})
export class TabService {
  private tabSubject : BehaviorSubject<string> = new BehaviorSubject<string>(TAB.CHAT);
  private contactTabSubject: BehaviorSubject<string> = new BehaviorSubject<string>(TAB.FRIEND_LIST);
  private mainTapSubject : BehaviorSubject<string> = new BehaviorSubject<string>(TAB.CHAT);

  constructor() { }

  getTab$() {
    return this.tabSubject.asObservable();
  }
  setTab(tab : string) {
    this.tabSubject.next(tab)
  }

  getContactTab$() {
    return this.contactTabSubject.asObservable()
  }

  setContactTab(tab : string) {
    this.contactTabSubject.next(tab);
  }

  getMainTab$() {
    return this.mainTapSubject.asObservable();
  }
  setMainTabSubject(tab: string) {
    this.mainTapSubject.next(tab);
  }
}
