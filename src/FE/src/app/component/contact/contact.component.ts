import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {
  faAddressBook,
  faAngleDown,
  faArrowUpAZ,
  faCheck, faEllipsis,
  faEnvelope,
  faSearch,
  faUserGroup
} from "@fortawesome/free-solid-svg-icons";
import {TAB} from "../../model/TAB";
import {TabService} from "../../service/tab.service";
import {CommonModule} from "@angular/common";
import {Friend} from "../../model/Friend";
import {FriendService} from "../../service/friend.service";
import {STATUS} from "../../model/STATUS";
import {BaseComponent} from "../../BaseComponent";
import {UserService} from "../../service/user.service";
import {User} from "../../model/User";
import {ChatService} from "../../service/chat.service";

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    FaIconComponent,
    CommonModule
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent extends BaseComponent implements OnInit, AfterViewInit {
  protected readonly TAB = TAB;
  protected readonly faEnvelope = faEnvelope;
  protected readonly faUserGroup = faUserGroup;
  protected readonly faSearch = faSearch;
  protected readonly faArrowUpAZ = faArrowUpAZ;
  protected readonly faCheck = faCheck;
  protected readonly faAngleDown = faAngleDown;
  protected readonly faAddressBook = faAddressBook;
  isSortMenu = false;
  contactTab$ = this.tabService.getContactTab$();
  currentUser = this.userService.getCurrentUser();
  friendRequests: Friend[] = [];
  friendMap: Map<string, Friend[]> = new Map();

  constructor(private tabService: TabService,
              private chatService: ChatService,
              private userService: UserService,
              private friendService: FriendService) {
    super();
  }

  ngAfterViewInit(): void {
  }


  ngOnInit(): void {
    this.initFriendListData();
    this.initFriendsRequestData();
  }

  protected readonly STATUS = STATUS;

  addFriend(friend: Friend) {
    this.friendService.addFriend(friend.owner.username)
  }

  deleteFriend(friend: Friend) {
    this.friendRequests.forEach((f, index) => {
      if (f.id === friend.id) {
        this.friendService.deleteFriend(friend.id).subscribe(_ => {
          this.friendRequests.splice(index, 1);
        })
        return;
      }
    })
  }

  private initFriendsRequestData() {
    const allFriendRequestSub = this.friendService.getAddFriendRequest().subscribe(request => {
        this.friendRequests = request;
    })

    const acceptedFriend = this.friendService.getFriend$().subscribe(friend => {
      if (!friend) return;

      if (friend.status === STATUS.ACTIVE) {
        const friendToUpdate =
          this.friendRequests.find(f => f.owner.username === friend.requestTo.username);
        if (friendToUpdate) friendToUpdate.status = friend.status
      }

      if (friend.status === STATUS.PENDING && friend.requestTo.username === this.currentUser.username) {
        this.friendRequests.push(friend)
      }

    })
    this.subscriptions.push(allFriendRequestSub);
    this.subscriptions.push(acceptedFriend);
  }

  private initFriendListData() {
    this.friendService.getAllFriend().subscribe(resp => {
      resp.forEach( friend => {
        const firstLetter = friend.requestTo.fullName[0].toUpperCase();
        const friendArray = this.friendMap.get(firstLetter) || [];
        friendArray.push(friend);
        this.friendMap.set(firstLetter, friendArray);
      })
    })
  }

  setMember(user : User) {
    this.subscriptions.push(this.chatService.setMember(user));
  }

  protected readonly faEllipsis = faEllipsis;
}
