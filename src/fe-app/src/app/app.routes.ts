import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { SettingsComponent } from './settings/settings.component';
import { GradesComponent } from './grades/grades.component';
import { NotificationsComponent } from './notifications/notifications.component';


import { AddTaskComponent } from './main/add-task/add-task.component';  // TODO this and its route is temporary

import { ProfileSettingsComponent } from './settings/profile-settings/profile-settings.component';
import { AppearanceSettingsComponent } from './settings/appearance-settings/appearance-settings.component';
import { NotificationSettingsComponent } from './settings/notification-settings/notification-settings.component';
import { SignOutComponent } from './settings/sign-out/sign-out.component';

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
    path: 'notifications',
    component: NotificationsComponent,
    title: 'Notifications'
  },
  {
    path: 'settings',
    component: SettingsComponent,
    title: 'Settings',
    children: [
      {
        path: 'profile',
        component: ProfileSettingsComponent
      },
      {
        path: 'appearance',
        component: AppearanceSettingsComponent
      },
      {
        path: 'notifications',
        component: NotificationSettingsComponent
      },
      {
        path: 'sign-out',
        component: SignOutComponent
      }
    ]
  },
  {
    path: 'grades',
    component: GradesComponent,
    title: 'Grades'
  },
  {
    path: 'main/add-task',
    component: AddTaskComponent,
    title: 'Add Task'
  }
];