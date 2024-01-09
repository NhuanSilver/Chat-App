import {Component, Input, OnInit} from '@angular/core';
import {MatDialogClose} from "@angular/material/dialog";
import {ReactiveFormsModule} from "@angular/forms";
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
import {BaseComponent} from "../../BaseComponent";
import {Friend} from "../../model/Friend";
import {FriendService} from "../../service/friend.service";
import {TabService} from "../../service/tab.service";
import {ToastrService} from "ngx-toastr";
import {STATUS} from "../../model/STATUS";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    MatDialogClose,
    ReactiveFormsModule,
    UserFormGroupComponent,
    FaIconComponent,
    CommonModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent extends BaseComponent implements OnInit {

  protected readonly environment = environment;
  @Input() users$ ?: Observable<User[]>;
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
   this.subscriptions.push(this.chatService.setMember(user))
  }

  isNotFriend(user: User): boolean {
    return !this.friends.some(f => f.requestTo.username === user.username);
  }
}
