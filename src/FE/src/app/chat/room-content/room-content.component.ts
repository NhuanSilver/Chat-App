import { Component } from '@angular/core';
import {ChatMessage} from "../../model/ChatMessage";
import {CommonModule} from "@angular/common";
import {MessageComponent} from "../message/message.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faPaperPlane} from "@fortawesome/free-regular-svg-icons";

@Component({
  selector: 'app-room-content',
  standalone: true,
  imports: [CommonModule, MessageComponent, ReactiveFormsModule, FaIconComponent],
  templateUrl: './room-content.component.html',
  styleUrl: './room-content.component.scss'
})
export class RoomContentComponent {
  messageForm !: FormGroup;

  chatMessages: ChatMessage[] = [
    {
      id: "nhuan_nhi",
      senderId: "nhuan",
      recipientId: "nhi",
      content: "Chào",
      sentAt:  new Date()
    },
    {
      id: "nhuan_linh",
      senderId: "linh",
      recipientId: "nhuan",
      content: "Hi",
      sentAt: new Date()

    },
    {
      id: "nhuan_linh",
      senderId: "nhuan",
      recipientId: "nhi",
      content: "Hello",
      sentAt: new Date()

    }
  ];

  constructor(private fb: FormBuilder) {
    this.messageForm = this.fb.group(
      {
        'messageControl': ['', Validators.required, Validators.minLength(1)]
      }
    )
  }

  onSubmit() {

  }

  protected readonly faPaperPlane = faPaperPlane;
}
