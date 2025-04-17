import { Component, inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterModule } from '@angular/router';

import { LoginService } from '../login.service';
import { HeartbeatService } from '../heartbeat.service';

import { Assignment } from '../course';
import { TaskListComponent } from './task-list/task-list.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { CoursesSidebarComponent } from "../main/courses-sidebar/courses-sidebar.component";
import { SecondarySidebarComponent } from './secondary-sidebar/secondary-sidebar.component';
import { GradeCalcComponent } from "../grade-calc/grade-calc.component";


@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrl: './main.component.css',
    imports: [
        RouterOutlet, RouterModule, CoursesSidebarComponent, SecondarySidebarComponent, AddTaskComponent, CommonModule,
        GradeCalcComponent
    ]
})
export class MainComponent implements OnInit {
    loginService = inject(LoginService);
    heartbeatService = inject(HeartbeatService);
    router = inject(Router);
    newTask: Assignment | null = null;
    @ViewChild(TaskListComponent) taskListComponent!: TaskListComponent;

    showPopup = false;
    popupType: 'add-task' |'grade-calc' | null = null;

    topThreeAssignments: Assignment[] = [];


    constructor() {
        if (this.router.url != "/main/task-list" && this.router.url != "/main/calendar" && this.router.url != "/main/grades") {
            this.router.navigateByUrl("/main/task-list");
        }
    }

    ngOnInit() {
        const userId = this.loginService.getUserId();
        console.log('UserId from app: ' + userId);
        if (userId) {
            this.heartbeatService.startHeartbeat(userId);
        } else {
            console.warn('No user ID found');
        }
    }

    handleNewTask(task: Assignment) {
      this.newTask = task;
      console.log('handleNewTask called with task in main:', task);
    }

    openPopup(type: 'add-task' | 'grade-calc'): void {
        this.popupType = type;
        this.showPopup = true;
        document.addEventListener('keydown', this.handleEscapeKey);
    }

    closePopup(): void {
        this.showPopup = false;
        this.popupType = null;
        document.removeEventListener('keydown', this.handleEscapeKey);
    }

    private handleEscapeKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        this.closePopup();
      }
    }

    handleBackdropClick(event: Event): void {
      this.closePopup();
    }
}
