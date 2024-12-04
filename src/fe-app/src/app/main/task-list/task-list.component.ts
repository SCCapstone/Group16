import { Component, inject } from '@angular/core';
import { title } from 'process';
import { Assignment } from '../../assignment';
import { AssignmentService } from '../../assignment.service';
import { LoginService } from '../../login.service';
import { CommonModule } from '@angular/common';
import { TaskComponent } from './task/task.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  
  test: Assignment[] = [];  // Do we need this?

  assignmentService = inject(AssignmentService);
  loginService = inject(LoginService);
  assignments: Assignment[] = [];

  getAssignmentTester(): void {
    this.assignmentService.getAssignments(this.loginService.getUserId())
      .then((assignments: Assignment[]) => {
        this.test = assignments;
        console.log(assignments[0].title);
        console.log(assignments);
      });
  }

  constructor() {
    this.assignmentService.getAssignments(this.loginService.getUserId())
    .then((assignments: Assignment[]) => {
      this.assignments = assignments;
    })
  }
  getAllTasks() {}
  filterTasks() {}
}
