import { Routes } from '@angular/router';
import {RegistrationComponent} from "./user/registration/registration.component";
import {LoginComponent} from "./user/login/login.component";
import {HomeComponent} from "./home/home.component";

export const routes: Routes = [
  {path : 'dang-ky', component : RegistrationComponent },
  {path: 'dang-nhap', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: '', redirectTo: '/dang-nhap', pathMatch: 'full' },
];

