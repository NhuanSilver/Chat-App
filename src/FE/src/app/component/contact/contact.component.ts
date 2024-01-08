import {Component, OnInit} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faAddressBook, faEnvelope, faUserGroup} from "@fortawesome/free-solid-svg-icons";
import {TAB} from "../../model/TAB";
import {TabService} from "../../service/tab.service";
import {AsyncPipe, CommonModule, NgIf} from "@angular/common";
import {Friend} from "../../model/Friend";
import {FriendService} from "../../service/friend.service";
import {STATUS} from "../../model/STATUS";
import {BaseComponent} from "../../BaseComponent";
import {UserService} from "../../service/user.service";

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
export class ContactComponent extends BaseComponent implements OnInit{

  protected readonly TAB = TAB;
  protected readonly faEnvelope = faEnvelope;
  protected readonly faUserGroup = faUserGroup;
  protected readonly Array = Array;

  protected readonly faAddressBook = faAddressBook;
  contactTab$ = this.tabService.getContactTab$();
  currentUser = this.userService.getCurrentUser();
  friendList$ = this.friendService.getAllFriend()
  friendRequests : Friend[] = []
  constructor(private tabService : TabService,
              private userService : UserService,
              private friendService: FriendService) {
    super();
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
        this.friendService.deleteFriend(friend.id).subscribe( _=> {
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

    const acceptedFriend = this.friendService.getFriend$().subscribe( friend => {
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

  }
}
