import { Routes } from '@angular/router';
import {AuthenticationComponent} from "./component/authentication/authentication.component";
import {HomeComponent} from "./component/home/home.component";
import {authGuard} from "./auth.guard";

export const routes: Routes = [
  {path: 'tai-khoan/:action', component: AuthenticationComponent},
  {path: '', component: HomeComponent, canActivate:[authGuard]},
];

