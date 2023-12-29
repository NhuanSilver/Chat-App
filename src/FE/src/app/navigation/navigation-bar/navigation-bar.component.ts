import { Component } from '@angular/core';
import {NavigationItemComponent} from "../navigation-item/navigation-item.component";
import {NavItem} from "../../model/NavItem";
import {faAddressBook, faMoon, faUser, faUserGroup} from "@fortawesome/free-solid-svg-icons";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [
    NavigationItemComponent,
    NgForOf
  ],
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss'
})
export class NavigationBarComponent {
  private navItems: NavItem[] =  [
    {
      name : "chat",
      icon : faUser,
      imgUrl: ""
    },
    {
      name: "group",
      icon: faUserGroup,
      imgUrl: ""
    },
    {
      name: "contact",
      icon: faAddressBook,
      imgUrl: ""
    },
  ]

  private userNavItems: NavItem[] =  [
    {
      name : "theme",
      icon : faMoon,
      imgUrl: ""
    },
    {
      name: "user",
      icon: undefined,
      imgUrl: "http://chatvia-light.react.themesbrand.com/static/media/avatar-1.3921191a8acf79d3e907.jpg"
    },
  ]
  public getNavItems () : NavItem[] {
    return this.navItems;
  }

  public getUserNavItems() : NavItem[] {
    return this.userNavItems;
  }
}
