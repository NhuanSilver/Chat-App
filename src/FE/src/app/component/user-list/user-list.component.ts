import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {MatDialogClose} from "@angular/material/dialog";
import {ReactiveFormsModule} from "@angular/forms";
import {environment} from "../../../environments/environment.development";
import {UserFormGroupComponent} from "../user-form-group/user-form-group.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {CommonModule} from "@angular/common";
import {Observable} from "rxjs";
import {User} from "../../model/User";
import {ChatService} from "../../service/chat.service";
import {BaseComponent} from "../../shared/BaseComponent";
import {FriendService} from "../../service/friend.service";

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
  styleUrl: './user-list.component.scss',
})
export class UserListComponent extends BaseComponent implements OnInit {

  protected readonly environment = environment;
  @ViewChild('checkbox') checkbox !: ElementRef;
  @Input() user !: User;
  @Input() parent !: string
  @Output() eventEmitter = new EventEmitter<Event>;
  isFriend !: Observable<boolean>;
  isSent: boolean = false;

  constructor(private friendService: FriendService,
              private chatService: ChatService) {
    super();
  }

  ngOnInit(): void {
    this.isFriend = this.friendService.checkFriend(this.user?.username)
  }


  addFriend(username: string, e: Event) {
    e.stopPropagation();
    this.friendService.addFriend(username);
    this.isSent = true;
  }

  setMember(user: User, event?: Event) {
    switch (this.parent) {
      case 'Thêm bạn' : {
        this.subscriptions.push(this.chatService.setMember(user))
        break;
      }
      case 'Tạo nhóm' : {
        if (event && event.target && (event.target as HTMLInputElement).type === 'checkbox') {
          break;
        }
        this.checkbox.nativeElement.checked = !this.checkbox.nativeElement.checked;
        this.eventEmitter.emit(this.checkbox.nativeElement);
        break;
      }
      default : {
        this.subscriptions.push(this.chatService.setMember(user))
      }
    }

  }


  sendUsernameToParent() {
    this.eventEmitter.emit(this.checkbox.nativeElement)
  }

}
