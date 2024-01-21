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

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    NgForOf,
    DatePipe,
    MyDatePipe,
    FaIconComponent
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent implements OnInit, AfterViewInit {
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
    if (this.message.contentType === "IMG") {
      this.imgToDisplay = this.JSON.parse(this.message.content)
    }
  }

  getCurrentUser(): User {

    return this.userService.getCurrentUser()
  }

  getAvatarUrl() {
    return this.conversation?.members.find(member => member.username === this.message.senderId)?.avatarUrl
  }

  deleteMessage(message: ChatMessage) {
    this.chatService.deleteMessage(message)
  }

  toggleMenu() {
    this.isOptionMenu = !this.isOptionMenu;
    const rect = this.optionMenu.nativeElement.getBoundingClientRect();
    const viewportHeight = document.documentElement.clientHeight;

    if (rect.top <= viewportHeight / 2) {
      // Phần tử nằm trên nửa màn hình
      this.renderer.setStyle(this.optionMenu.nativeElement, 'top', '-8rem');
    }
  }
}
