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

    /**
     * Takes in a list of assignments and returns a list of three incomplete assignments with the closest due dates
     */
    ngOnInit() {
        const userId = this.loginService.getUserId();
        if (userId)
            this.heartbeatService.startHeartbeat(userId);
        else
            console.warn('No user ID found');
    }

    /**
     * Gets the new task from the AddTaskComponent and sets it to the newTask property
     * @param task The task to be added
     */
    handleNewTask(task: Assignment) {
      this.newTask = task;
    }

    /**
     * Opens a popup for adding a task or calculating grades
     * @param type The type of popup to open
     */
    openPopup(type: 'add-task' | 'grade-calc'): void {
        this.popupType = type;
        this.showPopup = true;
        document.addEventListener('keydown', this.handleEscapeKey);
    }

    /**
     * Closes the popup and resets the popup type
     */
    closePopup(): void {
        this.showPopup = false;
        this.popupType = null;
        document.removeEventListener('keydown', this.handleEscapeKey);
    }
    /**
     * Closes the popup when the escape key is pressed
     * @param event
     */
    private handleEscapeKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        this.closePopup();
      }
    }

    /**
     * Closes the popup when the backdrop is clicked
     * @param event
     */
    handleBackdropClick(event: Event): void {
      this.closePopup();
    }
}
