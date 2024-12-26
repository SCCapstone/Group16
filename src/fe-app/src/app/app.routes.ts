import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { SettingsComponent } from './settings/settings.component';
import { GradesComponent } from './grades/grades.component';
import { NotificationsComponent } from './notifications/notifications.component';


import { AddTaskComponent } from './main/add-task/add-task.component';  // TODO this and its route is temporary

export const routes: Routes = [
  {
    path: 'classmate',
    component: HomeComponent,
    title: 'Home'
  },
  {
    path: 'classmate/login',
    component: LoginComponent,
    title: 'Login'
  },
  {
    path: 'classmate/main',
    component: MainComponent,
    title: 'Main'
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
    title: 'Notifications'
  },
  {
    path: 'classmate/settings',
    component: SettingsComponent,
    title: 'Settings'
  },
  {
    path: 'classmate/grades',
    component: GradesComponent,
    title: 'Grades'
  },
  {
    path: 'classmate/main/add-task',
    component: AddTaskComponent,
    title: 'Add Task'
  },
  {
    path: '',
    redirectTo: 'classmate',
    pathMatch: 'full'
  }
];
