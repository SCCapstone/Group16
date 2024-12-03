import { Component, inject } from '@angular/core';
import { title } from 'process';
import { Assignment } from '../../assignment';
import { AssignmentService } from '../../assignment.service';
import { LoginService } from '../../login.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  tasks: undefined; // undefined temporary until type Task is created
  test: Assignment[] = [];
  assignmentService = inject(AssignmentService);
  loginService = inject(LoginService);

  getAssignmentTester(): void {
    this.assignmentService.getAssignments(this.loginService.getUserId())
      .then((assignments: Assignment[]) => {
        this.test = assignments;
        console.log(assignments[0].title);
        console.log(assignments);
      });
  }

  constructor() {}
  getAllTasks() {}
  filterTasks() {}
}
