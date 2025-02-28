import { Component, inject, ChangeDetectorRef, effect } from '@angular/core';

import { LoginService } from '../../login.service';
import { CourseService } from '../../course.service';
import { AssignmentService } from '../../assignment.service';
import { CommonModule } from '@angular/common';
import { Course } from '../../course';
import { Assignment } from '../../course';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
  weekStart: Date;
  pageNumber: number;
  assignments: Assignment[] = [];
  weekAssignments: Assignment[][] = [[], [], [], [], [], [], []];  // TODO can't find a way to do this with Array(...)?

  loginService = inject(LoginService);
  courseService = inject(CourseService);
  // assignmentService = inject(AssignmentService);

  constructor(private assignmentService: AssignmentService, private cdr: ChangeDetectorRef) {
    this.weekStart = this.getWeekStart(new Date(Date.now()));
    this.pageNumber = 0;

    // Set logic to run whenever the AssignmentService signal updates (e.g. its constructor finishes or an assignment is added)
    effect(() => {
      const signal = this.assignmentService.getUpdateSignal();  // Referencing the signal is necessary for it to work
      console.log("COMPUTED SIGNAL RUN: Value " + signal);
      this.loadAssignments();                                   // Runs when service constructor finishes, no need to call twice
    })
  }

  async loadAssignments() {
    this.assignments = await this.assignmentService.getAssignments(this.loginService.getUserId());

    // Turn assignment date strings into date objects and sort entire list by date
    for (let assignment of this.assignments) {
      assignment.availability.adaptiveRelease.end = new Date(assignment.availability.adaptiveRelease.end)
    }
    this.assignments.sort((a: Assignment, b: Assignment) => {
      return (a.availability.adaptiveRelease.end.getTime() <= b.availability.adaptiveRelease.end.getTime() ? -1 : 1);
    });

    this.organizeWeekAssignments();
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
    this.weekAssignments = [[], [], [], [], [], [], []];
    console.log(this.weekAssignments);
    this.weekStart.setDate(this.weekStart.getDate() + 7);
    this.pageNumber++;
    this.organizeWeekAssignments();
  }

  pageBack() {
    this.weekAssignments = [[], [], [], [], [], [], []];
    this.weekStart.setDate(this.weekStart.getDate() - 7);
    this.pageNumber--;
    this.organizeWeekAssignments();
  }
}
