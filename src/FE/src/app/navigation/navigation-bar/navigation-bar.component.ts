import { Component } from '@angular/core';
import {NavigationItemComponent} from "../navigation-item/navigation-item.component";
import {NavItem} from "../../model/NavItem";
import {faAddressBook, faMoon, faUser, faUserGroup} from "@fortawesome/free-solid-svg-icons";
import {CommonModule, NgForOf} from "@angular/common";
import {UserService} from "../../service/user.service";

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [
    NavigationItemComponent,
    CommonModule
  ],
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss'
})
export class NavigationBarComponent {
  user = this.userService.getCurrentUser()
  constructor(private userService: UserService) {
  }
  private navItems: NavItem[] =  [
    {
      name : "chat",
      icon : faUser,
    },
    {
      name: "group",
      icon: faUserGroup,
    },
    {
      name: "contact",
      icon: faAddressBook,
    },
  ]

  private userNavItems: NavItem[] =  [
    {
      name : "theme",
      icon : faMoon,
    },
  ]
  public getNavItems () : NavItem[] {
    return this.navItems;
  }

  public getUserNavItems() : NavItem[] {
    return this.userNavItems;
  }
}
