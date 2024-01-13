import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationBarComponent} from "../navigation-bar/navigation-bar.component";
import {NavigationContentComponent} from "../navigation-content/navigation-content.component";
import {RoomContentComponent} from "../room-content/room-content.component";
import {WebsocketService} from "../../service/websocket.service";
import {TabService} from "../../service/tab.service";
import {AsyncPipe, NgIf} from "@angular/common";
import {TAB} from "../../model/TAB";
import {ContactComponent} from "../contact/contact.component";
import {FriendService} from "../../service/friend.service";
import {ToastrService} from "ngx-toastr";
import {STATUS} from "../../model/STATUS";
import {User} from "../../model/User";
import {UserService} from "../../service/user.service";
import {distinctUntilChanged} from "rxjs";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavigationBarComponent,
    NavigationContentComponent,
    RoomContentComponent,
    NgIf,
    AsyncPipe,
    ContactComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy{
  protected readonly TAB = TAB;
  mainTab$ = this.tabService.getMainTab$().pipe(distinctUntilChanged());
  constructor(private websocketService: WebsocketService,
              private friendService: FriendService,
              private userService: UserService,
              private toastService : ToastrService,
              private tabService: TabService) {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.websocketService.connect();

    this.friendService.getFriend$().subscribe( friend => {
      if (!friend) return;
      if (friend.owner.username === this.userService.getCurrentUser().username && friend.status === STATUS.PENDING) {
        this.toastService.success("Đã gửi lời mới kết bạn đến " + friend.requestTo.fullName)
      }
      if (friend.requestTo.username === this.userService.getCurrentUser().username && friend.status === STATUS.PENDING) {
        this.toastService.info(friend.owner.fullName + " đã yêu cầu kết bạn với bạn ")
      }
      if (STATUS.ACTIVE === friend.status &&friend.requestTo.username === this.userService.getCurrentUser().username) {
          this.toastService.success(friend.owner.fullName + " đã đồng ý kết bạn với bạn")
      }
    })

  }
}
