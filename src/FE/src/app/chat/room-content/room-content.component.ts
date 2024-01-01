import {Component, ElementRef, ViewChild} from '@angular/core';
import {ChatMessage} from "../../model/ChatMessage";
import {CommonModule} from "@angular/common";
import {MessageComponent} from "../message/message.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faPaperPlane} from "@fortawesome/free-regular-svg-icons";
import {ChatService} from "../../service/chat.service";
import {map, of, switchMap} from "rxjs";
import {Conversation} from "../../model/Conversation";
import {BaseComponent} from "../../BaseComponent";
import {NavigationItemComponent} from "../../navigation/navigation-item/navigation-item.component";
import {faSearch, faPhone, faBars} from "@fortawesome/free-solid-svg-icons";
import {NavItem} from "../../model/NavItem";
import {User} from "../../model/User";
import {UserService} from "../../service/user.service";

@Component({
  selector: 'app-room-content',
  standalone: true,
  imports: [CommonModule, MessageComponent, ReactiveFormsModule, FaIconComponent, NavigationItemComponent],
  templateUrl: './room-content.component.html',
  styleUrl: './room-content.component.scss'
})
export class RoomContentComponent extends BaseComponent {
  @ViewChild('chatBox') chatBox !: ElementRef;
  protected readonly faPaperPlane = faPaperPlane;
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

  messageForm !: FormGroup;
  chatMessages: ChatMessage[] = [];
  conversation !: Conversation

  chatMessagesSub = this.chatService.conversation$.pipe(
    switchMap(cvs => {
      if (cvs) {
        this.conversation = cvs
        return this.chatService.getConversationMessages(cvs.id)
      }
      return of([]);
    })
  ).subscribe(value => {
    this.chatMessages = value;
    this.scrollToBottom()
  })
  newMessageSub = this.chatService.getMessages$().pipe(
  ).subscribe(value => {
    if (value && this.conversation.id === value.conversationId) {

      this.chatMessages.push(value)
      this.scrollToBottom()
    }
  })
  recipients$ = this.userService.getRecipients$()
    .pipe(map(recipients => recipients
      .filter(re => re.username !== this.currentUser.username)))

  constructor(private fb: FormBuilder, private chatService: ChatService, private userService: UserService) {
    super();
    this.messageForm = this.fb.group(
      {
        messageControl: ['', [Validators.required, Validators.minLength(1)]]
      }
    )
    this.subscriptions.push(this.chatMessagesSub)
    this.subscriptions.push(this.newMessageSub)
  }

  onSubmit(recipients : User[]) {
    const recipientsClone = [...recipients]
    recipientsClone.push(this.currentUser)
    this.chatService.sendMessage({
      conversationId: this.conversation.id || '',
      recipientIds: recipientsClone.map(re => re.username),
      content: this.messageForm.get('messageControl')?.value
    })
    this.messageForm.get('messageControl')?.setValue('')
  }

  scrollToBottom() {
    if (this.conversation != undefined) {
      setTimeout(() => {
        this.chatBox.nativeElement.scrollIntoView()
      }, 0)
    }
  }

}
