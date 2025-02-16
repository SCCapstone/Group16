import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { HeartbeatService } from '../heartbeat.service';
import { AddTaskComponent } from './add-task/add-task.component';
import { LoginService } from '../login.service';
import { CoursesSidebarComponent } from "../main/courses-sidebar/courses-sidebar.component";
import { DueSoonSidebarComponent } from '../main/due-soon-sidebar/due-soon-sidebar.component';
import { CommonModule } from '@angular/common';


const VIEW_CALENDAR: number = 0;
const VIEW_TASK_LIST: number = 1;
const VIEW_NOTIFICATIONS: number = 2; // This will not be necessary if I can get notification overlay working

@Component({
    selector: 'app-main',
    standalone: true,
    templateUrl: './main.component.html',
    styleUrl: './main.component.css',
    imports: [RouterOutlet, RouterModule, CoursesSidebarComponent, DueSoonSidebarComponent,AddTaskComponent, CommonModule]
})
export class MainComponent implements OnInit {
  loginService = inject(LoginService);
  heartbeatService = inject(HeartbeatService);
  output: string | null = ''; // to be removed for testing only

  router = inject(Router);

  showPopup = false;
  popupType: 'add-task' | null = null;

  // Redirect user to task-list if they are just in /main.
  constructor() {
    if (this.router.url != "/main/task-list" && this.router.url != "/main/calendar") {
      this.router.navigateByUrl("/main/task-list");
    }
  }

  ngOnInit() {
    const userId = this.loginService.getUserId();
    console.log('UserId from app: ' + userId);
    if(userId) {
      this.heartbeatService.startHeartbeat(userId);
    } else {
      console.warn('no id')
    }
  }

  getUserId(): void { // function used just to test that we can access userId will be removed
    console.log(this.loginService.getUserId());
    if(this.loginService.getUserId()) {
      this.output = this.loginService.getUserId();
    }
  }

  // Will be refactored with consts when I figure out how; 0 = calendar, 1 = task list, 2 =
  viewSelect: number = 1;

  openPopup(type: 'add-task'): void {
    this.popupType = type;
    this.showPopup = true;
    console.log(this.showPopup)
  }

  closePopup(): void {
    this.showPopup = false;
    this.popupType = null;
  }
}
