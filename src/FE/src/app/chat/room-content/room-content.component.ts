import {Component, ElementRef, ViewChild} from '@angular/core';
import {ChatMessage} from "../../model/ChatMessage";
import {CommonModule} from "@angular/common";
import {MessageComponent} from "../message/message.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faPaperPlane} from "@fortawesome/free-regular-svg-icons";
import {ChatService} from "../../service/chat.service";
import { of, switchMap} from "rxjs";
import {Conversation} from "../../model/Conversation";
import {BaseComponent} from "../../BaseComponent";

@Component({
  selector: 'app-room-content',
  standalone: true,
  imports: [CommonModule, MessageComponent, ReactiveFormsModule, FaIconComponent],
  templateUrl: './room-content.component.html',
  styleUrl: './room-content.component.scss'
})
export class RoomContentComponent extends BaseComponent {
  @ViewChild('chatBox') chatBox !: ElementRef;
  protected readonly faPaperPlane = faPaperPlane;
  messageForm !: FormGroup;
  chatMessages: ChatMessage[] = [];
  conversation !: Conversation

  chatMessagesSub = this.chatService.conversation$.pipe(
    switchMap(cvs => {
      if (cvs) {
        this.conversation = cvs
        return  this.chatService.getConversationMessages(cvs.id)
      }
      return of([]);
    })
  ).subscribe( value => {
    this.chatMessages = value;
    this.scrollToBottom()
  })
  newMessageSub = this.chatService.getMessages$().pipe(
  ).subscribe( value => {
    if (value && this.conversation.id === value.conversationId) {

      this.chatMessages.push(value)
      this.scrollToBottom()
    }
  } )

  constructor(private fb: FormBuilder, private chatService: ChatService) {
    super();
    this.messageForm = this.fb.group(
      {
        messageControl: ['', [Validators.required, Validators.minLength(1)]]
      }
    )
    this.subscriptions.push(this.chatMessagesSub)
    this.subscriptions.push(this.newMessageSub)
  }

  onSubmit() {
      this.chatService.sendMessage({
        conversationId: this.conversation.id,
        recipientIds: this.conversation.members.map(member => member.username),
        content: this.messageForm.get('messageControl')?.value
      })
      this.messageForm.get('messageControl')?.setValue('')
  }

  scrollToBottom() {
    if (this.conversation != undefined) {
      setTimeout(() => {
        this.chatBox.nativeElement.scrollIntoView()
      }, 200)
    }
  }

}
