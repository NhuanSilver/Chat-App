import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../model/User";
import {STATUS} from "../../model/STATUS";
import {CommonModule} from "@angular/common";
import {ChatService} from "../../service/chat.service";
import {UserService} from "../../service/user.service";
import {Conversation} from "../../model/Conversation";
import {BaseComponent} from "../../shared/BaseComponent";
import {TabService} from "../../service/tab.service";
import {TAB} from "../../model/TAB";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faImage} from "@fortawesome/free-solid-svg-icons";
import {MyDatePipe} from "../../shared/my-date.pipe";

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [CommonModule, FaIconComponent, MyDatePipe],
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss'
})
export class RoomComponent extends BaseComponent implements OnInit {
  @Input() conversation !: Conversation
  protected readonly faImage = faImage;
  protected readonly STATUS = STATUS;
  members: User[] = [];

  constructor(private chatService: ChatService,
              private tabService : TabService,
              private userService: UserService) {
    super();
  }

  ngOnInit(): void {
    this.members = this.conversation.members.filter(
      member => {
        return this.userService.getCurrentUser().username !== member.username
      }
    )
    const userSub = this.chatService.getUser$().subscribe(user => {
      if (user) {
        const member = this.members.find(m => m.username === user.username);
        if (member) member.status = user.status;
      }
    })

    this.subscriptions.push(userSub);
  }
  getCurrentUser() {
    return this.userService.getCurrentUser();
  }

  setConversation() {
    this.chatService.setConversation(this.conversation);
    this.chatService.setActiveConversation(this.conversation)
    this.tabService.setMainTabSubject(TAB.CHAT)

  }

  getActivatedCvs() {
    return this.chatService.getActiveConversation$()
  }

}
