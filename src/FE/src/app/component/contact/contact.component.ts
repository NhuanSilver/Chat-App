import { Component } from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faAddressBook, faEnvelope, faUserGroup} from "@fortawesome/free-solid-svg-icons";
import {TAB} from "../../model/TAB";
import {TabService} from "../../service/tab.service";
import {AsyncPipe, CommonModule, NgIf} from "@angular/common";

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    FaIconComponent,
    CommonModule
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {

  protected readonly faAddressBook = faAddressBook;
  contactTab$ = this.tabService.getContactTab$()
  constructor(private tabService : TabService) {
  }

  protected readonly TAB = TAB;
  protected readonly faEnvelope = faEnvelope;
  protected readonly faUserGroup = faUserGroup;
  protected readonly Array = Array;
}
