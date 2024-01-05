import {Component, OnInit} from '@angular/core';
import {RoomComponent} from "../../chat/room/room.component";
import {CommonModule} from "@angular/common";
import {ChatService} from "../../service/chat.service";
import {Conversation} from "../../model/Conversation";
import {BaseComponent} from "../../BaseComponent";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {MatDialog} from "@angular/material/dialog";
import {SearchComponent} from "../../search/search/search.component";
import {of, switchMap} from "rxjs";
import {UserService} from "../../service/user.service";

@Component({
  selector: 'app-navigation-content',
  standalone: true,
  imports: [
    CommonModule,
    RoomComponent,
    FaIconComponent
  ],
  templateUrl: './navigation-content.component.html',
  styleUrl: './navigation-content.component.scss'
})
export class NavigationContentComponent extends BaseComponent implements OnInit {
  conversations: Conversation[] = []
  protected readonly faSearch = faSearch;

  constructor(private chatService: ChatService,
              private userService: UserService,
              public dialog: MatDialog) {
    super();

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

        if (conversion && !this.conversations.some(c => c.id ===conversion.id)) {
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


  openSearchModal() {
    const dialogRef = this.dialog.open(SearchComponent, {data: {name: 'nhuan', age: 22}})
  }

  private loadConversation() {
    this.subscriptions.push(this.chatService.getAllConversations()
      .subscribe(resp => {
        this.conversations = this.sortConversation(resp)
      }))
  }


}
