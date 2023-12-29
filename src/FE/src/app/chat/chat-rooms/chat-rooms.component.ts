import {Component} from '@angular/core';
import {RoomComponent} from "../room/room.component";
import {User} from "../../model/User";
import {CommonModule} from "@angular/common";
import {STATUS} from "../../model/STATUS";

@Component({
  selector: 'app-chat-rooms',
  standalone: true,
  imports: [
    CommonModule,
    RoomComponent
  ],
  templateUrl: './chat-rooms.component.html',
  styleUrl: './chat-rooms.component.scss'
})
export class ChatRoomsComponent {
  users: User[] = [
    {
      username : "nhuan",
      fullName : "Nhuận Nguyễn",
      imgUrl: "http://chatvia-light.react.themesbrand.com/static/media/avatar-2.feb0f89de58f0ef9b424.jpg",
      status: STATUS.ONLINE
    },
    {
      username : "nhi",
      fullName : "Một Ngươi Nào Đó",
      imgUrl: "http://chatvia-light.react.themesbrand.com/static/media/avatar-4.b23e41d9c09997efbc21.jpg",
      status: STATUS.ONLINE
    },
    {
      username : "linh",
      fullName : "Mà Ta Có Thể Tìm Thấy",
      imgUrl: "http://chatvia-light.react.themesbrand.com/static/media/avatar-5.a5c59cee7b3dfda1156d.jpg",
      status: STATUS.OFFLINE
    },
  ];

}
