import {Component, Inject, OnInit} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {UserListComponent} from "../user-list/user-list.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {environment} from "../../../environments/environment.development";
import {CommonModule} from "@angular/common";
import {catchError, debounceTime, distinctUntilChanged, map, Observable, of, switchMap} from "rxjs";
import {UserService} from "../../service/user.service";
import {User} from "../../model/User";

@Component({
  selector: 'app-pop-up',
  standalone: true,
  imports: [
    CommonModule,
    FaIconComponent,
    UserListComponent,
    ReactiveFormsModule
  ],
  templateUrl: './pop-up.component.html',
  styleUrl: './pop-up.component.scss'
})
export class PopUpComponent implements OnInit {

  protected readonly faSearch = faSearch;
  controlProps = environment.FORM_CONTROL;
  form !: FormGroup;
  users$ !: Observable<User[]>

  constructor(private fb: FormBuilder,
              private userService: UserService,
              public dialogRef: MatDialogRef<PopUpComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { name: string }) {
  }

  ngOnInit(): void {
    this.initFormControls()
  }

  private initFormControls() {

    this.form = this.fb.group({
        [this.controlProps.SEARCH]: [''],
      }
    )

    if (this.data.name === 'Tạo nhóm') {
      this.form.addControl(this.controlProps.GROUP_NAME, new FormControl(''))
    }
    this.users$ = this.form.controls[this.controlProps.SEARCH]?.valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      switchMap(value => {
          if (value.length === 0) return of([])

          if (this.data.name === 'Thêm bạn') {
            return this.userService.searchUserNotFriendByUsernameOrFullName(value).pipe(catchError(_=> of([])))
          }
          if (this.data.name === 'Tạo nhóm') {
            return this.userService.searchUserFriendByUsernameOrName(value).pipe(catchError(_=> of([])))
          }
          return of([])
        }
      ),
      catchError(_ => {
        return of([])
      }))

  }
}
