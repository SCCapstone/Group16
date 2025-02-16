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
import { CalendarComponent } from './main/calendar/calendar.component';
import { TaskListComponent } from './main/task-list/task-list.component';
import { EditTaskComponent } from './main/edit-task/edit-task.component';
import { GradeCalcComponent } from './grades/grade-calc/grade-calc.component';
import { authGuard } from './auth.guard';

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
    title: 'Main',
    canActivate: [authGuard],
    children: [
      {
        path: 'calendar',
        component: CalendarComponent,
        canActivate: [authGuard]
      },
      {
        path: 'task-list',
        component: TaskListComponent,
        canActivate: [authGuard]
      }
    ]
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
    title: 'Notifications',
    canActivate: [authGuard]
  },
  {
    path: 'settings',
    component: SettingsComponent,
    title: 'Settings',
    canActivate: [authGuard],
    children: [
      {
        path: 'profile',
        component: ProfileSettingsComponent,
        canActivate: [authGuard]
      },
      {
        path: 'appearance',
        component: AppearanceSettingsComponent,
        canActivate: [authGuard]
      },
      {
        path: 'notifications',
        component: NotificationSettingsComponent,
        canActivate: [authGuard]
      },
      {
        path: 'sign-out',
        component: SignOutComponent,
        canActivate: [authGuard]
      }
    ]
  },
  {
    path: 'grades',
    component: GradesComponent,
    title: 'Grades',
    canActivate: [authGuard]
  },
  {
    path: 'main/add-task',
    component: AddTaskComponent,
    title: 'Add Task',
    canActivate: [authGuard],
  },
  {
    path: 'main/edit-task/:id',
    component: EditTaskComponent,
    title: 'Edit Task',
    canActivate: [authGuard]
  },
  {
    path: 'calendar',
    component: CalendarComponent,
    title: 'Calendar',
    canActivate: [authGuard]
  },
  {
    path: 'task-list',
    component: TaskListComponent,
    title: 'Task-List',
    canActivate: [authGuard]
  },
  {
    path: 'grades/grade-calc',
    component: GradeCalcComponent,
    title: 'Grade-Calc',
    canActivate: [authGuard],
  },
  {
    matcher: (url) => {
      if (url.length > 0 && (url[0].path.startsWith('api') || url[0].path.startsWith('swagger-ui.html') || url[0].path.startsWith('v3'))) {
        return null; // Do not match these routes
      }
      return { consumed: url };
    },
    redirectTo: '',
    pathMatch: 'full'
  }
];
