import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ChatMessage} from "../../model/ChatMessage";
import {CommonModule} from "@angular/common";
import {MessageComponent} from "../message/message.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faPaperPlane} from "@fortawesome/free-regular-svg-icons";
import {ChatService} from "../../service/chat.service";
import {forkJoin, of, switchMap, tap} from "rxjs";
import {Conversation} from "../../model/Conversation";
import {BaseComponent} from "../../BaseComponent";
import {NavigationItemComponent} from "../navigation-item/navigation-item.component";
import {faSearch, faPhone, faBars, faFaceSmile} from "@fortawesome/free-solid-svg-icons";
import {NavItem} from "../../model/NavItem";
import {User} from "../../model/User";
import {UserService} from "../../service/user.service";
import {STATUS} from "../../model/STATUS";
import {PickerComponent} from "@ctrl/ngx-emoji-mart";

@Component({
  selector: 'app-room-content',
  standalone: true,
  imports: [CommonModule, MessageComponent, ReactiveFormsModule, FaIconComponent, NavigationItemComponent, PickerComponent],
  templateUrl: './room-content.component.html',
  styleUrl: './room-content.component.scss'
})
export class RoomContentComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild('chatBox') chatBox !: ElementRef;
  @ViewChild('emojiPicker') picker !: ElementRef<any>;
  @ViewChild('emojiToggle') togglePicker !: ElementRef<HTMLButtonElement>;
  protected readonly faPaperPlane = faPaperPlane;
  protected readonly STATUS = STATUS;
  protected readonly faFaceSmile = faFaceSmile;
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
  isEmojiPicker = false;
  currentUser = this.userService.getCurrentUser();

  messageForm !: FormGroup;
  chatMessages: ChatMessage[] = [];
  recipients: User[] = [];
  conversation: Conversation | undefined;

  chatMessagesSub = this.chatService.getConversation$().pipe(
    switchMap(conversation => {
      this.conversation = conversation;
      if (this.conversation) {
        this.recipients = this.conversation.members.filter(member => member.username !== this.currentUser.username);
        return this.chatService.getConversationMessages(this.conversation.id,
          new Set([...this.conversation.members.map(r => r.username)]))
      }
      this.chatMessages = []
      return this.chatService.getRecipients$()

    }),
    tap(value => {
      if (Array.isArray(value) && value.length > 0 && 'conversationId' in value[0]) {
        this.scrollToBottom();

      }
    })
  ).subscribe(value => {

    if (Array.isArray(value) && value.length > 0 && 'username' in value[0]) {
      this.recipients = (value as User[]).filter(member => member.username !== this.currentUser.username);
    } else {
      this.chatMessages = value as ChatMessage[];

    }
  })

  newMessageSub = this.chatService.getMessage$().pipe(
    switchMap(value => {
      if (!value) {
        return of(undefined);
      }
      if (this.conversation) {
        return forkJoin({
          newMessage: of(value),
          conversation: of(undefined)
        });
      }

      const conversationObservable = this.chatService.getConversationById(value.conversationId);
      return forkJoin({
        newMessage: of(value),
        conversation: conversationObservable
      });
    })
  ).subscribe(value => {
    if (!value) return;

    // Add message to active conversion
    if (value.newMessage && this.conversation?.id === value.newMessage.conversationId) {
      this.chatMessages.push(value.newMessage)
      this.scrollToBottom();
    }

    //Add new message to new conversation
    if (value.conversation) {
      this.conversation = value.conversation
      this.chatMessages.push(value.newMessage)
    }

  })

  constructor(private fb: FormBuilder,
              private chatService: ChatService,
              private userService: UserService,
              private renderer: Renderer2) {
    super();

    this.messageForm = this.fb.group(
      {
        messageControl: ['', [Validators.required, Validators.minLength(1)]]
      }
    )

    this.subscriptions.push(this.chatMessagesSub)
    this.subscriptions.push(this.newMessageSub)
  }

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
  }

  onSubmit(recipients: User[]) {

    const recipientsClone = [...recipients]
    this.isEmojiPicker = false;

    this.chatService.sendMessage({

      conversationId: this.conversation != undefined ? this.conversation.id : '',
      recipientIds: recipientsClone.map(re => re.username),
      content: this.messageForm.get('messageControl')?.value

    })

    this.messageForm.get('messageControl')?.setValue('')
  }

  private scrollToBottom() {

    if (this.conversation) {

      setTimeout(() => {
        this.chatBox.nativeElement.scrollIntoView()
      }, 50)

    }
  }

  onEmojiSelect($event: any) {
    const inputValue = this.messageForm.controls['messageControl']?.value;
    this.messageForm.controls['messageControl']?.setValue(inputValue + $event.emoji.native);

  }
}
