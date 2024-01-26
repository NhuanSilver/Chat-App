import { HttpInterceptorFn } from '@angular/common/http';
import {inject} from "@angular/core";
import {UserService} from "./service/user.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UserService);

  let authReq = req;
  let token = userService.getCurrentUser()?.token;
  if (token != null && token !== '') {
    authReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) });
  }
  return next(authReq);
};
