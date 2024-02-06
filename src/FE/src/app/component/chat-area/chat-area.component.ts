import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ChatMessage} from "../../model/ChatMessage";
import {CommonModule} from "@angular/common";
import {MessageComponent} from "../message/message.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {ChatService} from "../../service/chat.service";
import {distinctUntilChanged, filter, map, switchMap} from "rxjs";
import {Conversation} from "../../model/Conversation";
import {BaseComponent} from "../../shared/BaseComponent";
import {NavigationItemComponent} from "../navigation-item/navigation-item.component";
import {faBars, faPhone, faSearch} from "@fortawesome/free-solid-svg-icons";
import {NavItem} from "../../model/NavItem";
import {User} from "../../model/User";
import {UserService} from "../../service/user.service";
import {STATUS} from "../../model/STATUS";
import {PickerComponent} from "@ctrl/ngx-emoji-mart";
import {FormChatComponent} from "../form-chat/form-chat.component";
import {MESSAGE_TYPE} from "../../model/MESSAGE_TYPE";
import {MessagePipe} from "../../shared/message.pipe";

@Component({
  selector: 'app-chat-area',
  standalone: true,
  imports: [CommonModule, MessageComponent, FaIconComponent, NavigationItemComponent, PickerComponent, FormChatComponent, MessagePipe],
  templateUrl: './chat-area.component.html',
  styleUrl: './chat-area.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatAreaComponent extends BaseComponent implements OnInit {
  @ViewChild('bottom') bottom !: ElementRef;
  @ViewChild('chatBox') chatBox !: ElementRef;
  @ViewChild('emojiPicker') picker !: ElementRef;
  @ViewChild('emojiToggle') togglePicker !: ElementRef<HTMLButtonElement>;
  @ViewChild("inputFile") inputFile !: ElementRef;
  protected readonly STATUS = STATUS;

  protected readonly roomNavItems: NavItem[] = [
    {
      name: 'search',
      icon: faSearch
    },
    {
      name: 'phone',
      icon: faPhone
    },
    {
      name: 'bar',
      icon: faBars
    }
  ]

  currentUser = this.userService.getCurrentUser();

  chatMessages: ChatMessage[] = [];
  recipients: User[] = [];
  conversation: Conversation | undefined;

  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private cdf: ChangeDetectorRef) {
    super();

  }


  ngOnInit(): void {
    this.initConversation();
    this.chatService.getNewConversation$().subscribe(cvs => this.conversation = cvs)
  }


  private initConversation() {
    const conversationOsb = this.chatService.getConversation$().pipe(
      switchMap(conversation => {
        this.conversation = conversation;
        if (this.conversation) {

          this.recipients = this.conversation.members.filter(member => !this.userService.isCurrentUser(member.username));
          return this.chatService.getConversationMessages(this.conversation.id, this.currentUser.username).pipe(distinctUntilChanged())
        }
        return this.chatService.getRecipients$().pipe(
          map(users => users.filter(member => member.username !== this.currentUser.username))
        );

      })
    ).subscribe(value => {

      if (this.isUserArr(value)) {

        this.recipients = value as User[];
        this.chatMessages = [];
        this.cdf.detectChanges()
      } else if (Array.isArray(value)) {

        this.chatMessages = value as ChatMessage[];
        this.cdf.detectChanges();
        this.scrollToBottom();
      }
    })

    const newMessageSub = this.chatService.getMessage$().pipe(
      filter(newMessage => this.conversation?.id === newMessage.conversationId)
    )
      .subscribe(newMessage => {

        if (newMessage.messageType === MESSAGE_TYPE.CREATE) {
         if (this.chatMessages.length > 0) {
           const latestMessage =  this.chatMessages[this.chatMessages.length - 1];
           const length = this.chatMessages.length;
           this.chatMessages.splice(length - 1, 1);
           this.chatMessages = [...this.chatMessages, latestMessage, newMessage]
         } else {
           this.chatMessages.push(newMessage);
         }
        } else {
          this.editMessage(newMessage);
        }
        this.cdf.detectChanges();
        this.scrollToBottom()

      })
    this.subscriptions.push(newMessageSub)
    this.subscriptions.push(conversationOsb)
  }

  private editMessage(newMessage: ChatMessage) {
    this.chatMessages.forEach((mess, index) => {
      if (newMessage.id === mess.id) {

        if (newMessage.messageType === MESSAGE_TYPE.DELETE) {
          this.chatMessages.splice(index, 1);
          if (index == 0) {
            const messageToEdit = this.chatMessages[index];
            this.chatMessages[index] = {...messageToEdit};
            this.cdf.detectChanges()
            this.chatMessages[index] = messageToEdit;
            this.cdf.detectChanges();
          }

          if (index > 0) {
            const messageToEdit = this.chatMessages[index - 1];
            this.chatMessages[index - 1] = {...messageToEdit};
            this.cdf.detectChanges()
            this.chatMessages[index - 1] = messageToEdit;
            this.cdf.detectChanges();
          }

          this.notifyLatestMessage();
        }

        if (newMessage.messageType === MESSAGE_TYPE.RECALL) {
          this.chatMessages[index] = newMessage;
          this.notifyLatestMessage();

        }

      }
    })
  }

  private notifyLatestMessage() {
    if (this.conversation?.latestMessage) {
      this.conversation.latestMessage = this.chatMessages[this.chatMessages.length - 1];
      this.chatService.setNewConversation(this.conversation)
    }
  }

  private isUserArr(value: unknown) {
    return Array.isArray(value) && value.length > 0 && 'username' in value[0]
  }
  scrollToBottom () {
    this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight
  }

}
