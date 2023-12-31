import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {RoomComponent} from "../../component/room/room.component";
import {CommonModule} from "@angular/common";
import {ChatService} from "../../service/chat.service";
import {Conversation} from "../../model/Conversation";
import {BaseComponent} from "../../BaseComponent";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faAdd, faSearch, faUserGroup} from "@fortawesome/free-solid-svg-icons";
import {SearchComponent} from "../search/search.component";
import {catchError, debounceTime, distinctUntilChanged, map, Observable, of, switchMap} from "rxjs";
import {UserService} from "../../service/user.service";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {environment} from "../../../environments/environment.development";
import {User} from "../../model/User";
import {TAB} from "../../model/TAB";
import {TabService} from "../../service/tab.service";
import {TabsListComponent} from "../tabs-list/tabs-list.component";

@Component({
  selector: 'app-navigation-content',
  standalone: true,
  imports: [
    CommonModule,
    RoomComponent,
    FaIconComponent,
    SearchComponent,
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

  conversations: Conversation[] = []
  protected readonly faSearch = faSearch;
  formGroup !: FormGroup;
  users$ ?: Observable<User[]>;
  currentTab = this.tabService.getTab$()
  isSearchMenu: boolean = false;
  onFocus: boolean = false;

  constructor(private chatService: ChatService,
              private userService: UserService,
              private fb: FormBuilder,
              private tabService : TabService,
              private renderer: Renderer2) {
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
    this.chatService.getMessage$()
      .pipe(
        switchMap(newMessage => {
          if (!newMessage) {
            return of(undefined);
          }

          const existingConversation = this.conversations.find(cvs => cvs.id === newMessage.conversationId);

          if (existingConversation) {

            existingConversation.latestMessage = newMessage;
            this.conversations = this.sortConversation(this.conversations);
            return of(undefined);

          } else {

            return this.chatService.getConversationById(newMessage.conversationId);
          }

        })
      )
      .subscribe(conversion => {

        if (conversion && !this.conversations.some(c => c.id === conversion.id)) {
          this.conversations.push(conversion)
          this.conversations = this.sortConversation(this.conversations)
          if (this.conversations.length > 0 && conversion.latestMessage.senderId === this.userService.getCurrentUser().username) {
            this.chatService.setActiveConversation(conversion)
          }
        }

      })

  }


  sortConversation(conversationsToSort: Conversation[]) {
    return conversationsToSort.sort((a, b) => {
      return new Date(b?.latestMessage?.sentAt)?.getTime() - new Date(a?.latestMessage?.sentAt)?.getTime();
    })
  }


  private loadConversation() {
    this.subscriptions.push(this.chatService.getAllConversations()
      .subscribe(resp => {
        this.conversations = this.sortConversation(resp)
      }))
  }


  protected readonly faAdd = faAdd;
  protected readonly faUserGroup = faUserGroup;
  protected readonly environment = environment;
  protected readonly TAB = TAB;
}
