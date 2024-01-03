import {Component, Input, OnInit} from '@angular/core';
import {IconDefinition} from "@fortawesome/free-regular-svg-icons";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-user-form-group',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FaIconComponent
  ],
  templateUrl: './user-form-group.component.html',
  styleUrl: './user-form-group.component.scss'
})
export class UserFormGroupComponent{
  @Input() control !: FormControl;
  @Input() placeholder = '';
  @Input() type !: 'text' | 'password' | 'email' | 'number' ;
  @Input() icon !: IconDefinition;

  constructor() {

  }

}
