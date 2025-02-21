import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterModule } from '@angular/router';

import { LoginService } from '../login.service';
import { HeartbeatService } from '../heartbeat.service';
import { Assignment } from '../course'; // Ensure Assignment is correctly imported
import { TaskListComponent } from './task-list/task-list.component';
import { CoursesSidebarComponent } from "../main/courses-sidebar/courses-sidebar.component";
import { DueSoonSidebarComponent } from './due-soon-sidebar/due-soon-sidebar.component';
import { AddTaskComponent } from './add-task/add-task.component';

@Component({
    selector: 'app-main',
    standalone: true,
    templateUrl: './main.component.html',
    styleUrl: './main.component.css',
    imports: [
        RouterOutlet, RouterModule, TaskListComponent, CoursesSidebarComponent, DueSoonSidebarComponent, AddTaskComponent, CommonModule 
    ]
})
export class MainComponent implements OnInit {
    loginService = inject(LoginService);
    heartbeatService = inject(HeartbeatService);
    router = inject(Router);
    
    output: string | null = ''; // For testing purposes

    showPopup = false;
    popupType: 'add-task' | null = null;

    topThreeAssignments: Assignment[] = [];
    

    constructor() {
        if (this.router.url != "/main/task-list" && this.router.url != "/main/calendar") {
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

    handleDueSoonAssignments(assignments: Assignment[]): void {
        console.log('Top 3 Due Soon Assignments:', assignments);
        this.topThreeAssignments = assignments;
      }
      
      

    getUserId(): void { 
        console.log(this.loginService.getUserId());
        if (this.loginService.getUserId()) {
            this.output = this.loginService.getUserId();
        }
    }

    viewSelect: number = 1;

    openPopup(type: 'add-task'): void {
        this.popupType = type;
        this.showPopup = true;
    }

    closePopup(): void {
        this.showPopup = false;
        this.popupType = null;
    }
}
