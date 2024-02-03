import {AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ChatMessage} from "../../model/ChatMessage";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {UserService} from "../../service/user.service";
import {User} from "../../model/User";
import {Conversation} from "../../model/Conversation";
import {MyDatePipe} from "../../shared/my-date.pipe";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faEllipsisVertical} from "@fortawesome/free-solid-svg-icons";
import {ChatService} from "../../service/chat.service";
import {MESSAGE_TYPE} from "../../model/MESSAGE_TYPE";
import {MessagePipe} from "../../shared/message.pipe";

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    NgForOf,
    DatePipe,
    MyDatePipe,
    MessagePipe,
    FaIconComponent
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent implements OnInit, AfterViewInit {
  @Input() isFirstMessage !: boolean
  @Input() message !: ChatMessage
  @Input() displaySentAt !: boolean
  @Input() position !: string
  @Input() conversation: Conversation | undefined

  @ViewChild('optionMenu') optionMenu !: ElementRef;
  @ViewChild('toggleOptionMenu') toggleOptionMenu !: ElementRef;

  protected readonly JSON = JSON;
  protected readonly faEllipsisVertical = faEllipsisVertical;
  isOptionMenu: boolean = false;

  imgToDisplay: string [] = [];
  protected readonly MESSAGE_TYPE = MESSAGE_TYPE;

  constructor(private userService: UserService,
              private chatService : ChatService,
              private renderer: Renderer2) {

  }

  ngAfterViewInit(): void {
    this.renderer.listen('window', 'click', e => {
      if (!this.toggleOptionMenu.nativeElement.contains(e.target)
        && !this.optionMenu.nativeElement.contains(e.target)) {
        this.isOptionMenu = false
      }
    })
  }

  ngOnInit(): void {
    if (this.message.contentType === "IMG" && this.message.messageType !== MESSAGE_TYPE.RECALL) {
      this.imgToDisplay = this.JSON.parse(this.message.content)
    }
  }

  getCurrentUser(): User {

    return this.userService.getCurrentUser()
  }

  getAvatarUrl() {
    return this.conversation?.members.find(member => member.username === this.message.sender.username)?.avatarUrl
  }

  deleteMessage(message: ChatMessage) {
    this.chatService.deleteMessage(message)
  }

  recallMessage(message: ChatMessage) {
    this.chatService.recallMessage(message)
  }

  toggleMenu() {
    this.isOptionMenu = !this.isOptionMenu;
  }

}
