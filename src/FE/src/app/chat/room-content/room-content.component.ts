import {Component, OnInit} from '@angular/core';
import {ChatMessage} from "../../model/ChatMessage";
import {CommonModule} from "@angular/common";
import {MessageComponent} from "../message/message.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faPaperPlane} from "@fortawesome/free-regular-svg-icons";
import {ChatService} from "../../service/chat.service";
import { switchMap} from "rxjs";
import {UserService} from "../../service/user.service";
import {Conversation} from "../../model/Conversation";

@Component({
  selector: 'app-room-content',
  standalone: true,
  imports: [CommonModule, MessageComponent, ReactiveFormsModule, FaIconComponent],
  templateUrl: './room-content.component.html',
  styleUrl: './room-content.component.scss'
})
export class RoomContentComponent implements OnInit {
  protected readonly faPaperPlane = faPaperPlane;

  messageForm !: FormGroup;
  conversation !: Conversation;

  chatMessages: ChatMessage[] = [];

  ngOnInit(): void {
    this.chatService.conversation$
      .pipe(
        switchMap(conversation => {
          if (conversation != undefined){
            this.conversation = conversation;
            return this.chatService.getConversationMessages(conversation.id)
          }
          return []
        })
      )
      .subscribe(message => this.chatMessages = message)

  }

  constructor(private fb: FormBuilder, private chatService: ChatService, private userService: UserService) {
    this.messageForm = this.fb.group(
      {
        'messageControl': ['', [Validators.required, Validators.minLength(1)]]
      }
    )
  }


  onSubmit() {
    this.chatService.sendMessage({
      conversationId: this.conversation.id,
      recipientIds: this.conversation.members.map(member => member.username),
      content: this.messageForm.get('messageControl')?.value
    })
    this.messageForm.get('messageControl')?.setValue('')
  }
}
