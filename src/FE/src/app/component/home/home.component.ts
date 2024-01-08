import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationBarComponent} from "../navigation-bar/navigation-bar.component";
import {NavigationContentComponent} from "../navigation-content/navigation-content.component";
import {RoomContentComponent} from "../room-content/room-content.component";
import {WebsocketService} from "../../service/websocket.service";
import {TabService} from "../../service/tab.service";
import {AsyncPipe, NgIf} from "@angular/common";
import {TAB} from "../../model/TAB";
import {ContactComponent} from "../contact/contact.component";

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
  mainTab$ = this.tabService.getMainTab$();
  constructor(private websocketService: WebsocketService,
              private tabService: TabService) {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.websocketService.connect();

  }
}
