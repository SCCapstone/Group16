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
  pageNumber: number;
  assignments: Assignment[] = [];
  weekAssignments: Assignment[][] = [[], [], [], [], [], [], []];

  loginService = inject(LoginService);
  courseService = inject(CourseService);
  assignmentService = inject(AssignmentService);

  constructor() {
    this.weekStart = this.getWeekStart(new Date(Date.now()));
    this.pageNumber = 0;
    this.assignmentService.getAssignments(this.loginService.getUserId()).then((assignments) => {
      this.assignments = assignments;

      // Turn assignment date strings into date objects and sort entire list by date
      for (let assignment of this.assignments) {
        assignment.availability.adaptiveRelease.end = new Date(assignment.availability.adaptiveRelease.end)
      }
      this.assignments.sort((a: Assignment, b: Assignment) => {
        return (a.availability.adaptiveRelease.end.getTime() <= b.availability.adaptiveRelease.end.getTime() ? -1 : 1);
      });

      this.organizeWeekAssignments();
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
    const millisecondsPerDay = 86400000;
    for (const assignment of this.assignments) {
      const difference = assignment.availability.adaptiveRelease.end.getTime() - this.weekStart.getTime();
      
      // Ignore options out of range (can break if too high because array was sorted in constructor)
      if (difference < 0)
        continue;
      if (difference >= 7 * millisecondsPerDay)
        break;

      // Add assignment to array if it's in range based on the day it falls into
      this.weekAssignments[difference / millisecondsPerDay].push(assignment);
    }
  }

  pageForward() {
    this.weekStart.setDate(this.weekStart.getDate() + 7);
    this.pageNumber++;
    this.organizeWeekAssignments();
  }

  pageBack() {
    this.weekStart.setDate(this.weekStart.getDate() - 7);
    this.pageNumber--;
    this.organizeWeekAssignments();
  }
}
