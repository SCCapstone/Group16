import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginService } from '../../login.service';
import { Course } from '../../course';
import { CourseService } from '../../course.service';
import { Assignment } from '../../course';
import { AssignmentService } from '../../assignment.service';
import { TaskComponent } from './task/task.component';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskComponent,FormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {

  test: Assignment[] = [];  // Do we need this?

  loginService = inject(LoginService);
  courseService = inject(CourseService);
  assignmentService = inject(AssignmentService);

  courses: Course[] = []
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
    this.courseService.getCourses(this.loginService.getUserId())
    .then((courses: Course[]) => {
      this.courses = courses;
    })

    this.assignmentService.getAssignments(this.loginService.getUserId())
    .then((assignments: Assignment[]) => {
      this.assignments = assignments;
      console.log(assignments[0].availability.adaptiveRelease.end)
    })
  }
  getAllTasks() {}
  filterTasks() {}
}
