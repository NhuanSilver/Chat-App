import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {UserService} from "../../service/user.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Component, OnInit} from "@angular/core";
import {HttpClientModule} from "@angular/common/http";
import {StorageService} from "../../service/storage.service";
import {STATUS} from "../../model/STATUS";
import {UserFormGroupComponent} from "../user-form-group/user-form-group.component";
import {faLock, faUser} from "@fortawesome/free-solid-svg-icons";
import {NgIf} from "@angular/common";
import {environment} from "../../../environments/environment.development";

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    UserFormGroupComponent,
    NgIf,
    RouterLink
  ],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.scss'
})
export class AuthenticationComponent implements OnInit {
  protected readonly faUser = faUser;
  protected readonly faLock = faLock;
  actionType !: string;
  formGroup !: FormGroup;
  USER_ACTION = environment.USER_ACTION;
  FORM_CONTROL = environment.FORM_CONTROL;

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private router: Router,
              private storageService: StorageService,
              private activatedRoute: ActivatedRoute) {
  }

  onSubmit() {
    if (this.actionType === this.USER_ACTION.LOGIN) {
      this.doLogin()
    } else {
      this.doRegister()
    }
  }

  getControl(name: string) {
    return this.formGroup.get(name) as FormControl;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const actionType = params['action'];
      if ([this.USER_ACTION.LOGIN, this.USER_ACTION.REGISTER].includes(actionType)) {
        this.actionType = actionType;
        this.createForm()
      }
    })
  }

  private doLogin() {
    this.userService.login(this.formGroup.get(this.FORM_CONTROL.USERNAME)?.value, this.formGroup.get(this.FORM_CONTROL.PASSWORD)?.value)
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

  private createForm() {
    this.formGroup = this.fb.group(
      {
        [this.FORM_CONTROL.USERNAME]: ['', Validators.required],
        [this.FORM_CONTROL.PASSWORD]: ['', Validators.required],

      }
    )
    if (this.actionType === this.USER_ACTION.REGISTER) {
      this.formGroup.addControl(this.FORM_CONTROL.FULL_NAME, new FormControl('', Validators.required));
    }
  }
}
