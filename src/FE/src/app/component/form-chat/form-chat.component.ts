import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import {faFaceSmile, faImage} from "@fortawesome/free-solid-svg-icons";
import {faPaperPlane} from "@fortawesome/free-regular-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgForOf, NgIf} from "@angular/common";
import {PickerComponent} from "@ctrl/ngx-emoji-mart";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {User} from "../../model/User";
import {BaseComponent} from "../../shared/BaseComponent";
import {MessageRequest} from "../../model/MessageRequest";
import {Conversation} from "../../model/Conversation";
import {ChatService} from "../../service/chat.service";
import {UserService} from "../../service/user.service";

@Component({
  selector: 'app-form-chat',
  standalone: true,
  imports: [
    FaIconComponent,
    NgForOf,
    NgIf,
    PickerComponent,
    ReactiveFormsModule
  ],
  templateUrl: './form-chat.component.html',
  styleUrl: './form-chat.component.scss'
})
export class FormChatComponent extends BaseComponent implements AfterViewInit{
    @Input() recipients !: User[];
    @Input() conversation : Conversation | undefined;
    @ViewChild('emojiPicker') picker !: ElementRef;
    @ViewChild('emojiToggle') togglePicker !: ElementRef<HTMLButtonElement>;
    @ViewChild("inputFile") inputFile !: ElementRef;

    protected readonly faImage = faImage;
    protected readonly faPaperPlane = faPaperPlane;
    protected readonly faFaceSmile = faFaceSmile;

  messageForm !: FormGroup;
  imgSrcArr: string[] = []
  isEmojiPicker = false;
  constructor(private fb: FormBuilder,
              private chatService: ChatService,
              private userService: UserService,
              private renderer: Renderer2,
              private cdf: ChangeDetectorRef) {
    super();

    this.messageForm = this.fb.group(
      {
        messageControl: ['', [Validators.required, Validators.minLength(1)]]
      }
    )

  }
  ngAfterViewInit(): void {
    this.renderer.listen('window', 'click', event => {
      if (!this.togglePicker.nativeElement.contains(event.target) && !this.picker.nativeElement.contains(event.target)) {
        this.isEmojiPicker = false;
      }
    })

  }

  readImg(event: Event) {

    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files) {
      for (let i = 0; i < inputElement.files.length; i++) {
        const fileReader = new FileReader();
        fileReader.onload = _ => {
          this.imgSrcArr.push(fileReader.result as string)
        }
        fileReader.readAsDataURL(inputElement.files[i]);
      }
    }
  }
  onSubmit(recipients: User[]) {

    const recipientsClone = [...recipients]

    const message = this.messageForm.get('messageControl')?.value as string

    if (!this.conversation) {
      this.subscriptions.push(this.chatService.createPrivateChat(this.userService.getCurrentUser().username + "_" + recipientsClone[0].username, recipientsClone[0].username)
        .subscribe(cvs => {

          if (cvs) {
            this.conversation = cvs;
            this.chatService.setNewConversation(this.conversation)
            this.sendMessageWithCondition(recipientsClone, cvs, message)
          }

        }))

    } else {

      this.sendMessageWithCondition(recipientsClone, this.conversation, message);

    }
  }
  onEmojiSelect($event: any) {
    const inputValue = this.messageForm.controls['messageControl']?.value;
    this.messageForm.controls['messageControl']?.setValue(inputValue + $event.emoji.native);

  }


  openFileInput() {
    this.inputFile.nativeElement.click()
  }


  deleteImg(imgSrc: string) {
    this.imgSrcArr.forEach((img, index) => {
      if (img === imgSrc) this.imgSrcArr.splice(index, 1);
    })
  }
  private sendMessage(message: MessageRequest) {
    this.chatService.sendMessage(message)
  }

  private sendMessageWithCondition(recipientsClone: User [], cvs: Conversation, message: string) {
    if (this.imgSrcArr.length > 0) {
      this.sendMessage({
        conversationId: cvs.id,
        content: JSON.stringify(this.imgSrcArr),
        type: "IMG",
        recipientIds: recipientsClone.map(re => re.username),
      });
    }
    if (message.trim().length > 0) {
      this.sendMessage({
        conversationId: cvs.id,
        content: message,
        type: "TEXT",
        recipientIds: recipientsClone.map(re => re.username),
      });
    }
    this.imgSrcArr = []
    this.inputFile.nativeElement.value = ""
    this.messageForm.get('messageControl')?.setValue('')
  }

}
