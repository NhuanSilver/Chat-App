import { Component } from '@angular/core';
import {ChatRoomsComponent} from "../../chat/chat-rooms/chat-rooms.component";

@Component({
  selector: 'app-navigation-content',
  standalone: true,
  imports: [
    ChatRoomsComponent
  ],
  templateUrl: './navigation-content.component.html',
  styleUrl: './navigation-content.component.scss'
})
export class NavigationContentComponent {

}
