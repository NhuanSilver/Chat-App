import {Component, Inject, OnInit} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {UserListComponent} from "../user-list/user-list.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {environment} from "../../../environments/environment.development";
import {CommonModule} from "@angular/common";
import {catchError, debounceTime, distinctUntilChanged, filter, Observable, of, switchMap} from "rxjs";
import {UserService} from "../../service/user.service";
import {User} from "../../model/User";
import {ChatService} from "../../service/chat.service";
import {BaseComponent} from "../../shared/BaseComponent";

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
export class PopUpComponent extends BaseComponent implements OnInit {

  protected readonly faSearch = faSearch;

  controlProps = environment.FORM_CONTROL;
  form !: FormGroup;
  users$ !: Observable<User[]>

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private chatService : ChatService,
              public dialogRef: MatDialogRef<PopUpComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { name: string }) {
    super();
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
      this.form.addControl(this.controlProps.GROUP_NAME, new FormControl('', Validators.required))
      this.form.addControl(this.controlProps.USERNAME, new FormArray ([], Validators.required));
    }
    this.users$ = this.form.controls[this.controlProps.SEARCH]?.valueChanges.pipe(
      debounceTime(100),
      filter(value => value.length > 0),
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


  createGroup() {
    const groupName = this.form.get(this.controlProps.GROUP_NAME)?.value
    const recipients = this.form.get(this.controlProps.USERNAME)?.value
    if(this.form.invalid) return;
    this.subscriptions.push(this.chatService.createGroupChat(groupName, [...recipients, this.userService.getCurrentUser().username]).subscribe(cvs => {
      this.chatService.setNewConversation(cvs)
      this.dialogRef.close();
    }))
  }

  handleCheckbox(event: any) {
    
    const checkboxes = this.form.get(this.controlProps.USERNAME) as FormArray;
    const isChecked = event.checked;
    
    if (isChecked) {
        checkboxes.push(new FormControl(event.value))
    } else {
      checkboxes.controls.forEach( (c, index) => {
        if (c.value === event.value) {
          checkboxes.removeAt(index)
          return;
        }
      })
    }
  }
}
