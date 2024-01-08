import {Component, OnInit} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faAddressBook, faEnvelope, faUserGroup} from "@fortawesome/free-solid-svg-icons";
import {TAB} from "../../model/TAB";
import {TabService} from "../../service/tab.service";
import {BaseComponent} from "../../BaseComponent";
import {Friend} from "../../model/Friend";
import {FriendService} from "../../service/friend.service";
import {STATUS} from "../../model/STATUS";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-tabs-list',
  standalone: true,
  imports: [
    FaIconComponent,
    NgIf
  ],
  templateUrl: './tabs-list.component.html',
  styleUrl: './tabs-list.component.scss'
})
export class TabsListComponent extends BaseComponent implements OnInit{

  protected readonly faAddressBook = faAddressBook;
  protected readonly faUserGroup = faUserGroup;
  protected readonly faEnvelope = faEnvelope

  currentTab = TAB.FRIEND_LIST;

  protected readonly TAB = TAB;

  friendRequests: Friend[] = [];

  constructor(private tabService : TabService,
              private friendService: FriendService) {
    super();
  }

  setActive(tab : TAB) {
    this.currentTab =  tab;
    this.tabService.setContactTab(tab);
    this.tabService.setMainTabSubject(TAB.CONTACT)
  }

  ngOnInit(): void {
    const allFriendRequestSub = this.friendService.getAddFriendRequest().subscribe(request => {
      this.friendRequests = request;
    })

    const requestSub = this.friendService.getFriend$().subscribe(request => {

      if (!request) return;

      if (request.status === STATUS.PENDING
        && this.friendRequests.every(f => f.owner.username != request.owner.username)) {
        this.friendRequests.push(request)
      }

    })
    this.subscriptions.push(requestSub);
    this.subscriptions.push(allFriendRequestSub);
  }
}
