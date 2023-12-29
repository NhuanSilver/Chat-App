import { Component } from '@angular/core';
import {NavigationBarComponent} from "../navigation/navigation-bar/navigation-bar.component";
import {NavigationContentComponent} from "../navigation/navigation-content/navigation-content.component";
import {RoomContentComponent} from "../chat/room-content/room-content.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavigationBarComponent,
    NavigationContentComponent,
    RoomContentComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
