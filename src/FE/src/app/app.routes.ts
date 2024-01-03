import { Routes } from '@angular/router';
import {AuthenticationComponent} from "./user/authentication/authentication.component";
import {HomeComponent} from "./home/home.component";

export const routes: Routes = [
  {path: 'tai-khoan/:action', component: AuthenticationComponent},
  {path: 'home', component: HomeComponent},
  {path: '', redirectTo: '/tai-khoan/dang-nhap', pathMatch: 'full' },
];

