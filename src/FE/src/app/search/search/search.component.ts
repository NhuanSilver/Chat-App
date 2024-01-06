import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {environment} from "../../../environments/environment.development";
import {UserFormGroupComponent} from "../../user/user-form-group/user-form-group.component";
import {faSearch, faUserFriends} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faPaperPlane} from "@fortawesome/free-regular-svg-icons";
import {CommonModule} from "@angular/common";
import {UserService} from "../../service/user.service";
import {catchError, debounceTime, distinctUntilChanged, filter, map, Observable, of, switchMap} from "rxjs";
import {User} from "../../model/User";
import {ChatService} from "../../service/chat.service";
import {BaseComponent} from "../../BaseComponent";
import {Friend} from "../../model/Friend";

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

  protected readonly faSearch = faSearch;
  protected readonly environment = environment;
  protected readonly faPaperPlane = faPaperPlane;
  protected readonly faUserFriends = faUserFriends;
  formGroup !: FormGroup;
  users$ ?: Observable<User[]>;
  friends : User[] = []

  constructor(private fb: FormBuilder,
              private chatService: ChatService,
              private userService: UserService,
              private diaglogRef: MatDialogRef<SearchComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    super();
    this.formGroup = this.fb.group({
      [environment.FORM_CONTROL.SEARCH]: ['']
    })
    let searchInput = this.formGroup.get(environment.FORM_CONTROL.SEARCH);
    this.users$ = searchInput?.valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      switchMap(value => {
          if (value.length === 0) return of([])
          return this.userService.searchUserByUsernameOrName(value).pipe(
            map(users => users.filter(user => user.username !== this.userService.getCurrentUser().username)),
            catchError(_ => {
              return of([])
            })
          )
        }
      ),
      catchError(_ => {
        return of([])
      })
    )
  }

  ngOnInit(): void {
    this.subscriptions.push( this.userService.getAllFriend().subscribe( friends => {
      console.log(friends)
      this.friends = friends;
    }))
  }


  addFriend(username: string, e: Event) {
    e.stopPropagation();
    console.log(username)
    this.chatService.addFriend(username);
  }

  setMember(user: User) {
    const cvsSub = this.chatService.getConversationByUsernames(this.userService.getCurrentUser().username, user.username)
      .subscribe({
        next :
          cvs => {
            if (cvs) {
              this.chatService.setConversation(cvs)
              this.chatService.setActiveConversation(cvs)
            } else {
              this.chatService.setRecipients([user])
              this.chatService.setConversation(undefined)
            }
          },

        error: _ => {
          this.chatService.setRecipients([user])
          this.chatService.setConversation(undefined)
        }
      })
    this.diaglogRef.close()
    this.subscriptions.push(cvsSub);
  }

  isNotFriend(user: User): boolean {
    console.log(!this.friends.some(u => u.username === user.username))
    return !this.friends.some(u => u.username === user.username);
  }
}
