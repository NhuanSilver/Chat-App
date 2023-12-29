import {Component, Input, OnInit} from '@angular/core';
import {NavItem} from "../../model/NavItem";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgIf, NgOptimizedImage} from "@angular/common";

@Component({
  selector: '[app-navigation-item]',
  standalone: true,
  imports: [
    FaIconComponent,
    NgIf,
    NgOptimizedImage
  ],
  templateUrl: './navigation-item.component.html',
  styleUrl: './navigation-item.component.scss'
})
export class NavigationItemComponent{
  @Input() item !: NavItem

}
