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

  loginService = inject(LoginService);
  courseService = inject(CourseService);
  assignmentService = inject(AssignmentService);
  
  courses: Course[] = []
  assignments: Assignment[][] = [ [], [] ]  // Active, complete

  test(): void {
    this.assignmentService.toggleViewCompleted();
  }

  constructor() {
    this.courseService.getCourses(this.loginService.getUserId())
    .then((courses: Course[]) => {
      this.courses = courses;
    })

    this.assignmentService.getAssignments(this.loginService.getUserId())
    .then((assignments: Assignment[]) => {
      this.filterAssignments(assignments);
      console.log(assignments[0].availability.adaptiveRelease.end)
    })
  }

  filterAssignments(assignments: Assignment[]) {
    for (const assignment of assignments) {
      if (assignment.complete && Date.now() >= (new Date(assignment.availability.adaptiveRelease.end)).getTime())
        this.assignments[1].push(assignment)
      else
        this.assignments[0].push(assignment);
    }
  }

  getCourseNameByID(id: String): String {
    for (const course of this.courses) {
      if (course.id === id)
        return course.name
    }
    return "Unknown";
  }

  getIndex() {
    return (this.assignmentService.getViewCompleted() ? 1 : 0);
  }
}
