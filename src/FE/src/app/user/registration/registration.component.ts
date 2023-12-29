import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
  registrationForm !: FormGroup
  constructor(private fb : FormBuilder) {
    this.registrationForm = this.fb.group(
      {
        'username' : ['', Validators.required],
        'fullName' : ['', Validators.required],
        'password' : ['', Validators.required],
      }
    )
  }

}
