import {Component, Input} from '@angular/core';
import {ChatMessage} from "../../model/ChatMessage";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {
  @Input() message !: ChatMessage
}
