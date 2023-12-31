import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {UserService} from "../../service/user.service";
import {Router} from "@angular/router";
import {Component} from "@angular/core";
import {HttpClientModule} from "@angular/common/http";
import {WebsocketService} from "../../service/websocket.service";
import {StorageService} from "../../service/storage.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm !: FormGroup;
  constructor(private fb : FormBuilder,
              private userService: UserService,
              private router: Router,
              private websocketService : WebsocketService,
              private storageService : StorageService) {
    this.loginForm = this.fb.group(
      {
        'username' : ['', Validators.required],
        'password' : ['', Validators.required]
      }
    )
  }

  onSubmit() {
    this.userService.login(this.loginForm.get('username')?.value, this.loginForm.get('password')?.value)
      .subscribe({
        next: user => {
            this.storageService.saveUser(user)
            this.websocketService.connect()
            this.router.navigate(['/home'])
          },
        error: err => {
          console.log(err)
        }
      })
  }
}
