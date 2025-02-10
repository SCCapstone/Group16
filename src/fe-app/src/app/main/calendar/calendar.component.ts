import { Component, inject } from '@angular/core';

import { LoginService } from '../../login.service';
import { CourseService } from '../../course.service';
import { AssignmentService } from '../../assignment.service';

import { Course } from '../../course';
import { Assignment } from '../../course';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
  weekStart: Date;
  assignments: Assignment[] = [];
  weekAssignments: Assignment[][] = [[], [], [], [], [], [], []];

  loginService = inject(LoginService);
  courseService = inject(CourseService);
  assignmentService = inject(AssignmentService);

  constructor() {
    this.weekStart = this.getWeekStart(new Date(Date.now()));
    this.assignmentService.getAssignments(this.loginService.getUserId()).then((assignments) => {
      this.assignments = assignments;

      // Turn assignment date strings into date objects
      for (let assignment of this.assignments) {
        assignment.availability.adaptiveRelease.end = new Date(assignment.availability.adaptiveRelease.end)
      }

      console.log("WEEK START: " + this.weekStart);
      this.pageForward();
      console.log("WEEK START: " + this.weekStart);
      this.pageBack();
      console.log("WEEK START: " + this.weekStart);
      
    });
  }

  // Get the midnight of Monday of the current week, used as anchor for assignments
  getWeekStart(currentDate: Date) {
    currentDate.setHours(0, 0, 0, 0);
    const difference = currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1);
    return new Date(currentDate.setDate(difference))
  }

  // Organize assignments into a list of assignments in the current week
  organizeWeekAssignments() {

  }

  pageForward() {
    this.weekStart.setDate(this.weekStart.getDate() + 7);
    this.organizeWeekAssignments();
  }

  pageBack() {
    this.weekStart.setDate(this.weekStart.getDate() - 7);
    this.organizeWeekAssignments();
  }
}
