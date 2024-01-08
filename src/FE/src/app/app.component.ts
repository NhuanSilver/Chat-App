import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink, RouterOutlet} from '@angular/router';
import {NavigationBarComponent} from "./component/navigation-bar/navigation-bar.component";
import {NavigationContentComponent} from "./component/navigation-content/navigation-content.component";
import {RoomContentComponent} from "./component/room-content/room-content.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, NavigationBarComponent, NavigationContentComponent, RoomContentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
