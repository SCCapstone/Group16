import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

const routeConfig: Routes = [
  {
    path: '',
    component: LoginComponent,
    title: 'Login'
  }
];

export default routeConfig;
