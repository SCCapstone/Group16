import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { SettingsComponent } from './settings/settings.component';
import { GradesComponent } from './grades/grades.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login'
  },
  {
    path: 'main',
    component: MainComponent,
    title: 'Main'
  },
  {
    path: 'settings',
    component: SettingsComponent,
    title: 'Settings'
  },
  {
    path: 'grades',
    component: GradesComponent,
    title: 'Grades'
  }
];