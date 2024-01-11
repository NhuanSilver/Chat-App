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
import {BaseComponent} from "../../shared/BaseComponent";
import {NavigationItemComponent} from "../navigation-item/navigation-item.component";
import {faSearch, faPhone, faBars, faFaceSmile, faImage} from "@fortawesome/free-solid-svg-icons";
import {NavItem} from "../../model/NavItem";
import {User} from "../../model/User";
import {UserService} from "../../service/user.service";
import {STATUS} from "../../model/STATUS";
import {PickerComponent} from "@ctrl/ngx-emoji-mart";
import {WebsocketService} from "../../service/websocket.service";
import {MessageRequest} from "../../model/MessageRequest";

@Component({
  selector: 'app-room-content',
  standalone: true,
  imports: [CommonModule, MessageComponent, ReactiveFormsModule, FaIconComponent, NavigationItemComponent, PickerComponent],
  templateUrl: './room-content.component.html',
  styleUrl: './room-content.component.scss'
})
export class RoomContentComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild('chatBox') chatBox !: ElementRef;
  @ViewChild('emojiPicker') picker !: ElementRef;
  @ViewChild('emojiToggle') togglePicker !: ElementRef<HTMLButtonElement>;
  @ViewChild("inputFile") inputFile !: ElementRef;
  protected readonly faPaperPlane = faPaperPlane;
  protected readonly STATUS = STATUS;
  protected readonly faFaceSmile = faFaceSmile;
  protected readonly faImage = faImage;
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
  imgSrcArr: string[] = []

  conversationSub = this.chatService.getConversation$().pipe(
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

  newMessageSub = this.chatService.getMessage$()
    .subscribe(newMessage => {
    if (!newMessage) return;

    // Add message to active conversion
    if (this.conversation?.id === newMessage.conversationId) {
      this.chatMessages.push(newMessage)
      this.scrollToBottom();
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

    this.subscriptions.push(this.conversationSub)
    this.subscriptions.push(this.newMessageSub)
  }

  ngAfterViewInit(): void {
    this.renderer.listen('window', 'click', event => {
      if (!this.togglePicker.nativeElement.contains(event.target) && !this.picker.nativeElement.contains(event.target)) {
        this.isEmojiPicker = false;
      }
    })

  }

  ngOnInit(): void {
  }

  getPositionOfMessage(message : ChatMessage) : string {
    const index = this.chatMessages.indexOf(message);
    const samePrevSender = message.senderId === this.chatMessages[index - 1]?.senderId;
    const sameNextSender = message.senderId === this.chatMessages[index + 1]?.senderId;


    if (index === 0 && !sameNextSender) return  'fl';
    if (index === 0) return 'f'
    if (index > 0) {

       if (!sameNextSender && !samePrevSender
          || !samePrevSender && new Date(this.chatMessages[index +1 ].sentAt).getMinutes() - new Date(message.sentAt).getMinutes() >=5
         || !sameNextSender && this.greaterThan5Minutes(message)
       ) return "fl";
       if (!sameNextSender) return 'l';
       if (!samePrevSender && sameNextSender || this.greaterThan5Minutes(message)) return 'f'
    }
    return 'middle';

  }
  greaterThan5Minutes(message : ChatMessage) {
    const index = this.chatMessages.indexOf(message);
    if (index === 0) return true;
    return new Date(message.sentAt).getMinutes() - new Date(this.chatMessages[index -1].sentAt).getMinutes() >= 5;
  }
  readImg(event: Event) {

    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files) {
      for (let i = 0; i < inputElement.files.length; i++) {
        const fileReader = new FileReader();
        fileReader.onload = e => {
          this.imgSrcArr.push(fileReader.result as string)
        }
        fileReader.readAsDataURL(inputElement.files[i]);
      }
    }
  }

  onSubmit(recipients: User[]) {

    const recipientsClone = [...recipients]

    const message = this.messageForm.get('messageControl')?.value as string

    if (!this.conversation) {
      this.chatService.createPrivateChat(this.currentUser.username + "_" + recipientsClone[0].username, recipientsClone[0].username)
        .subscribe(cvs => {
          if (cvs) {
            this.conversation = cvs;
            this.sendMessageWithCondition(recipientsClone, cvs, message)
          }

        })
    } else {
      this.sendMessageWithCondition(recipientsClone, this.conversation, message)
    }

  }


  onEmojiSelect($event: any) {
    const inputValue = this.messageForm.controls['messageControl']?.value;
    this.messageForm.controls['messageControl']?.setValue(inputValue + $event.emoji.native);

  }


  openFileInput() {
    this.inputFile.nativeElement.click()
  }


  deleteImg(imgSrc: string) {
    this.imgSrcArr.forEach((img, index) => {
      if (img === imgSrc) this.imgSrcArr.splice(index, 1);
    })
  }

  private sendMessage(message: MessageRequest) {
    this.chatService.sendMessage(message)
  }
  private sendMessageWithCondition( recipientsClone : User [], cvs : Conversation, message: string) {
    if (this.imgSrcArr.length > 0) {
      this.sendMessage({
        conversationId: cvs.id,
        content: JSON.stringify(this.imgSrcArr),
        type: "IMG",
        recipientIds: recipientsClone.map(re => re.username),
      });
    }
    if (message.trim().length > 0) {
      this.sendMessage({
        conversationId: cvs.id,
        content: message,
        type: "TEXT",
        recipientIds: recipientsClone.map(re => re.username),
      });
    }
    this.imgSrcArr = []
    this.inputFile.nativeElement.value = ""
    this.messageForm.get('messageControl')?.setValue('')
  }
  private scrollToBottom() {

    if (this.conversation) {

      setTimeout(() => {
        this.chatBox.nativeElement.scrollIntoView()
      }, 50)

    }
  }
}
