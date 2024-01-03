import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {UserService} from "../../service/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Component, OnInit} from "@angular/core";
import {HttpClientModule} from "@angular/common/http";
import {StorageService} from "../../service/storage.service";
import {STATUS} from "../../model/STATUS";
import {UserFormGroupComponent} from "../user-form-group/user-form-group.component";
import {faLock, faUser} from "@fortawesome/free-solid-svg-icons";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    UserFormGroupComponent,
    NgIf
  ],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.scss'
})
export class AuthenticationComponent implements OnInit{
  protected readonly faUser =  faUser;
  protected readonly faLock = faLock;
  actionType !: string;
  formGroup !: FormGroup;

  constructor(private fb : FormBuilder,
              private userService: UserService,
              private router: Router,
              private storageService : StorageService,
              private activatedRoute : ActivatedRoute) {
  }

  onSubmit() {
    if (this.actionType === 'dang-nhap') {
      this.doLogin()
    } else {
      this.doRegister()
    }
  }
  getControl(name : string) {
    return this.formGroup.get(name) as FormControl;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const actionType = params['action'];
      if (['dang-nhap', 'dang-ky'].includes(actionType)) {
        this.actionType =actionType;
        if (actionType === 'dang-nhap') {
          this.formGroup = this.fb.group(
            {
              'username' : ['', Validators.required],
              'password' : ['', Validators.required]
            }
          )
        }
        if (actionType === 'dang-ky') {
          this.formGroup = this.fb.group(
            {
              'username' : ['', Validators.required],
              'password' : ['', Validators.required],
              'fullName' : ['', Validators.required],
            }
          )
        }
      }
    })
  }

  private doLogin() {
    this.userService.login(this.formGroup.get('username')?.value, this.formGroup.get('password')?.value)
      .subscribe({
        next: user => {
          user.status = STATUS.ONLINE
          this.storageService.saveUser(user)
          this.router.navigate(['/home'])
        },
        error: err => {
          console.log(err)
        }
      })
  }

  private doRegister() {

  }
}
