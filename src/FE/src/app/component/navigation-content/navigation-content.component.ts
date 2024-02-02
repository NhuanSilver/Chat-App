import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {RoomComponent} from "../room/room.component";
import {CommonModule} from "@angular/common";
import {ChatService} from "../../service/chat.service";
import {Conversation} from "../../model/Conversation";
import {BaseComponent} from "../../shared/BaseComponent";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faAdd, faSearch, faUserGroup} from "@fortawesome/free-solid-svg-icons";
import {UserListComponent} from "../user-list/user-list.component";
import {catchError, debounceTime, distinctUntilChanged, map, Observable, of, switchMap, merge} from "rxjs";
import {UserService} from "../../service/user.service";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {environment} from "../../../environments/environment.development";
import {User} from "../../model/User";
import {TAB} from "../../model/TAB";
import {TabService} from "../../service/tab.service";
import {TabsListComponent} from "../tabs-list/tabs-list.component";
import {MatDialog} from "@angular/material/dialog";
import {PopUpComponent} from "../pop-up/pop-up.component";
import {MESSAGE_TYPE} from "../../model/MESSAGE_TYPE";

@Component({
  selector: 'app-navigation-content',
  standalone: true,
  imports: [
    CommonModule,
    RoomComponent,
    FaIconComponent,
    UserListComponent,
    ReactiveFormsModule,
    TabsListComponent
  ],
  templateUrl: './navigation-content.component.html',
  styleUrl: './navigation-content.component.scss'
})
export class NavigationContentComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild('searchMenu') searchMenu !: ElementRef<HTMLDivElement>;
  @ViewChild('searchInput') searchInput !: ElementRef<HTMLDivElement>;
  @ViewChild('form') formElement !: ElementRef<HTMLFormElement>;

  protected readonly faUserGroup = faUserGroup;
  protected readonly environment = environment;
  protected readonly TAB = TAB;
  protected readonly faSearch = faSearch;
  protected readonly faAdd = faAdd;

  conversations: Conversation[] = []
  formGroup !: FormGroup;
  users$ ?: Observable<User[]>;
  currentTab = this.tabService.getTab$()
  isSearchMenu: boolean = false;
  onFocus: boolean = false;

  constructor(private chatService: ChatService,
              private userService: UserService,
              private fb: FormBuilder,
              private tabService : TabService,
              private renderer: Renderer2,
              public diaglog: MatDialog) {
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
          return this.userService.searchUserFriendByUsernameOrName(value).pipe(
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

  ngAfterViewInit(): void {


    this.renderer.listen('window', 'click', e => {
      if (this.searchInput.nativeElement.contains(e.target)) {
        this.isSearchMenu = true;
        this.onFocus = true;
      }

      if (!this.searchInput.nativeElement.contains(e.target)) this.onFocus = false;
      if (!this.searchMenu.nativeElement.contains(e.target)
        && !this.searchInput.nativeElement.contains(e.target)
        && !this.formElement.nativeElement.contains(e.target)
      ) {
        this.isSearchMenu = false;
      }
    })
  }

  ngOnInit(): void {
    this.loadConversation();
    merge(
      this.chatService.getNewConversation$().pipe(distinctUntilChanged()),
      this.chatService.getMessage$()
    ).pipe(
      switchMap ( value =>  {
        if (value && 'group' in value && !this.conversations.includes(value)) return of(value as Conversation);

        if (value && 'conversationId' in value) {
          if (value.messageType === MESSAGE_TYPE.DELETE)  return of(undefined);
          const existingConversation = this.conversations.find(cvs => cvs.id === value.conversationId);
          if (existingConversation) {
              existingConversation.latestMessage = value
              existingConversation.updateAt = value.sentAt
            if (this.userService.isCurrentUser(value.senderId)) this.chatService.setActiveConversation(existingConversation)
            return of(undefined);
          }
          return this.chatService.getConversationById(value.conversationId)
        }
        return of(undefined);
      })
    )
      .subscribe(conversation => {
        if (conversation) {
          if(!conversation.group && this.userService.isCurrentUser(conversation.latestMessage?.senderId))
            this.chatService.setActiveConversation(conversation)
          this.conversations = this.sortConversation([...this.conversations, conversation]);
        }
        this.conversations = this.sortConversation(this.conversations)
      })

  }


  sortConversation(conversationsToSort: Conversation[]) {
    return conversationsToSort.sort((a, b) => {
      return new Date(b.updateAt)?.getTime() - new Date(a.updateAt)?.getTime();
    })
  }


  private loadConversation() {
    this.subscriptions.push(this.chatService.getAllConversations()
      .pipe(
        map(value => value.filter(cvs => !!cvs.latestMessage))
      )
      .subscribe(resp => {
        this.conversations = this.sortConversation(resp)
      }))
  }

  openUserAction(name : string) {
    this.diaglog.open(PopUpComponent, {
      data : {name : name}
    })
  }

}
