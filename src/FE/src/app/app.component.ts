import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink, RouterOutlet} from '@angular/router';
import {NavigationBarComponent} from "./component/navigation-bar/navigation-bar.component";
import {SideBarComponent} from "./component/side-bar/side-bar.component";
import {ChatAreaComponent} from "./component/chat-area/chat-area.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, NavigationBarComponent, SideBarComponent, ChatAreaComponent],
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {
}
