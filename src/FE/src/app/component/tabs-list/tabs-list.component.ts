import { Component } from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faAddressBook, faEnvelope, faUserGroup} from "@fortawesome/free-solid-svg-icons";
import {TAB} from "../../model/TAB";
import {TabService} from "../../service/tab.service";

@Component({
  selector: 'app-tabs-list',
  standalone: true,
  imports: [
    FaIconComponent
  ],
  templateUrl: './tabs-list.component.html',
  styleUrl: './tabs-list.component.scss'
})
export class TabsListComponent {

  protected readonly faAddressBook = faAddressBook;
  protected readonly faUserGroup = faUserGroup;
  protected readonly faEnvelope = faEnvelope

  currentTab = TAB.FRIEND_LIST;

  protected readonly TAB = TAB;

  constructor(private tabService : TabService) {
  }

  setActive(tab : TAB) {
    this.currentTab =  tab;
    this.tabService.setContactTab(tab);
  }
}
