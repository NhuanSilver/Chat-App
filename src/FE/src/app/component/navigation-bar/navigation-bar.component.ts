import {AfterViewInit, Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {NavItem} from "../../model/NavItem";
import {
  faAddressBook,
  faArrowRightFromBracket, faMessage,
  faMoon,
  faUser,
  faUserGroup
} from "@fortawesome/free-solid-svg-icons";
import {CommonModule} from "@angular/common";
import {UserService} from "../../service/user.service";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {WebsocketService} from "../../service/websocket.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TAB} from "../../model/TAB";
import {TabService} from "../../service/tab.service";

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [
    CommonModule,
    FaIconComponent
  ],
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss'
})
export class NavigationBarComponent implements AfterViewInit{
  @ViewChild('toggleButton') toggleButton !: ElementRef<HTMLDivElement>;
  @ViewChild('menu') menu !: ElementRef;
  protected readonly faUser = faUser;
  protected readonly faArrowRightFromBracket = faArrowRightFromBracket;
  isMenuOpen: boolean = false;
  user = this.userService.getCurrentUser()
  currentTab: string = TAB.CHAT;
  constructor(private userService: UserService,
              private webSocketService: WebsocketService,
              private tabService: TabService,
              private router: Router,
              private renderer : Renderer2) {


  }
  private navItems: NavItem[] =  [
    {
      name : TAB.CHAT,
      icon : faMessage,
    },
    {
      name: TAB.CONTACT,
      icon: faUserGroup,
    }
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
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  ngAfterViewInit(): void {
    this.renderer.listen('window', 'click', e => {
      if(!this.menu.nativeElement.contains(e.target) && !this.toggleButton.nativeElement.contains(e.target)){
        this.isMenuOpen = false;
      }
    })
  }

  logOut() {
    this.webSocketService.disconnect();
    this.userService.logOut()
    this.router.navigate(['/tai-khoan/dang-nhap'])

  }

  changeTab(item: NavItem) {
    this.currentTab = item.name;
    this.tabService.setTab(item.name)
    this.tabService.setMainTabSubject(item.name)
  }
}
