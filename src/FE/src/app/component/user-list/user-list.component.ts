import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatDialogClose} from "@angular/material/dialog";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {environment} from "../../../environments/environment.development";
import {UserFormGroupComponent} from "../user-form-group/user-form-group.component";
import {faSearch, faUserFriends} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faPaperPlane} from "@fortawesome/free-regular-svg-icons";
import {CommonModule} from "@angular/common";
import {UserService} from "../../service/user.service";
import {Observable} from "rxjs";
import {User} from "../../model/User";
import {ChatService} from "../../service/chat.service";
import {BaseComponent} from "../../shared/BaseComponent";
import {Friend} from "../../model/Friend";
import {FriendService} from "../../service/friend.service";
import {STATUS} from "../../model/STATUS";

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    MatDialogClose,
    ReactiveFormsModule,
    UserFormGroupComponent,
    FaIconComponent,
    CommonModule
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent extends BaseComponent implements OnInit {

  protected readonly environment = environment;
  @ViewChild('checkbox') checkbox !: ElementRef;
  @Input() users$ ?: Observable<User[]>;
  @Input() parent !: string
  @Output()  eventEmitter  = new EventEmitter<Event>;

  users: User[] = [];
  friends: Friend[] = []

  constructor(private friendService: FriendService,
              private chatService: ChatService) {
    super();
  }

  ngOnInit(): void {
    const allFriendSub = this.friendService.getAllFriend().subscribe(friends => {
      this.friends = friends;
    })

    const friendSub = this.friendService.getFriend$().subscribe(friend => {
      if (!friend) return;
      if (friend.status === STATUS.ACTIVE) {
        this.friends.push(friend)
      }
    })

    this.subscriptions.push(allFriendSub)
    this.subscriptions.push(friendSub);
  }


  addFriend(username: string, e: Event) {
    e.stopPropagation();
    this.friendService.addFriend(username);
  }

  setMember(user: User) {
    switch (this.parent) {
      case 'Thêm bạn' : {
        this.subscriptions.push(this.chatService.setMember(user))
        break;
      }
      case 'Tạo nhóm' : {

        break;
      }
      default : {
        this.subscriptions.push(this.chatService.setMember(user))
      }
    }

  }

  isNotFriend(user: User): boolean {
    return !this.friends.some(f => f.requestTo.username === user.username);
  }

  getParentClassName() {
    if (this.parent === 'Thêm bạn' ) return "add-friend";
    if (this.parent === 'Tạo nhóm') return "create-group"
    return "";
  }


  sendUsernameToParent($event: Event) {
    this.eventEmitter.emit($event)
  }
}
