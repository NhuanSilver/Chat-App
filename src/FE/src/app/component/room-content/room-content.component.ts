import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import {ChatMessage} from "../../model/ChatMessage";
import {CommonModule} from "@angular/common";
import {MessageComponent} from "../message/message.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {ChatService} from "../../service/chat.service";
import {distinctUntilChanged, filter, map, merge, switchMap} from "rxjs";
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

@Component({
  selector: 'app-room-content',
  standalone: true,
  imports: [CommonModule, MessageComponent, FaIconComponent, NavigationItemComponent, PickerComponent, FormChatComponent],
  templateUrl: './room-content.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrl: './room-content.component.scss'
})
export class RoomContentComponent extends BaseComponent implements OnInit{
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

  getPositionOfMessage(message: ChatMessage): string {
    const index = this.chatMessages.indexOf(message);
    const samePrevSender = message.senderId === this.chatMessages[index - 1]?.senderId;
    const sameNextSender = message.senderId === this.chatMessages[index + 1]?.senderId;


    if (index === 0 && (!sameNextSender || this.greaterThanNext5Minutes(message)) ) return 'fl';
    if (index === 0) return 'f';
    if (index > 0) {

      if (
        !sameNextSender && !samePrevSender
        || !samePrevSender && this.greaterThanNext5Minutes(message)
        || !sameNextSender && this.greaterThanPrevious5Minutes(message)
        || this.greaterThanPrevious5Minutes(message) && this.greaterThanNext5Minutes(message)

      ) return "fl";

      if (!sameNextSender || this.greaterThanNext5Minutes(message)) return 'l';
      if (!samePrevSender && sameNextSender || this.greaterThanPrevious5Minutes(message)) return 'f'
    }
    return 'middle';

  }

  greaterThanPrevious5Minutes(message: ChatMessage) {
    const index = this.chatMessages.indexOf(message);
    if (index === 0) return true;
    return this.minusMinutes(message.sentAt, this.chatMessages[index - 1].sentAt) >= 5;
  }

  greaterThanNext5Minutes (message : ChatMessage) {
    const index = this.chatMessages.indexOf(message);
    return this.minusMinutes(this.chatMessages[index + 1].sentAt, message.sentAt) >= 5;
  }

  minusMinutes(a : Date, b : Date) {
    return  Math.floor(((new Date(a).getTime() - new Date(b).getTime()) / 1000)/60)
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
    )

    const chatMssSub = merge(
      conversationOsb,
      this.chatService.getMessage$().pipe(
        filter(newMessage => this.conversation?.id === newMessage.conversationId)
      )
    ).subscribe(value => {
      if (Array.isArray(value) && value.length > 0 && 'username' in value[0]) {
        this.recipients = value as User[];
        this.chatMessages = [];
        this.cdf.detectChanges()
      } else if (Array.isArray(value)) {

        this.chatMessages = value as ChatMessage[];
        this.cdf.detectChanges();
      } else {
        const newMessage = value as ChatMessage

        if (this.chatMessages.some(mss => mss.id === newMessage.id))  {
          this.chatMessages.forEach( (mess, index) => {
            if (newMessage.id === mess.id) {
              this.chatMessages.splice(index, 1);
            }
          })
        } else {
          this.chatMessages.push(newMessage)
        }

        this.cdf.detectChanges();
      }
    })
    this.subscriptions.push(chatMssSub)
  }

}
