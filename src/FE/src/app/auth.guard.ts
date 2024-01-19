import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {UserService} from "./service/user.service";

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  if (!userService.getCurrentUser()){
    router.navigate(['/tai-khoan', 'dang-nhap'])
    return false;
  }
  return true;
};
