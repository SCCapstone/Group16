import { Component, inject, effect } from '@angular/core';

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
  weekStart: Date;                  // Start of the currently-selected week
  pageNumber: number;               // Offset from current week in number of weeks
  assignments: Assignment[] = [];
  weekAssignments: Assignment[][] = [[], [], [], [], [], [], []];

  loginService = inject(LoginService);
  courseService = inject(CourseService);

  // INITIALIZATION

  constructor(private assignmentService: AssignmentService) {
    this.weekStart = this.getWeekStart(new Date(Date.now()));  // Store start of the current week
    this.pageNumber = 0;

    // Set logic to run whenever the AssignmentService signal updates (e.g. its constructor finishes or an assignment is added)
    effect(() => {
      const signal = this.assignmentService.getUpdateSignal();  // Referencing the signal is necessary for it to work
      console.log("COMPUTED SIGNAL RUN: Value " + signal);

      // Runs when service constructor finishes, no need to call twice
      this.loadAssignments().then(() => {
        this.organizeWeekAssignments();
      });
    })
  }

  /**
   * Retrieves and sorts all assignments from AssignmentService and stores in "assignments"
   */
  async loadAssignments() {
    this.assignments = await this.assignmentService.getAssignments(this.loginService.getUserId());
    console.log("TEST ASSIGNMENTS:" + this.assignments);

    // Turn assignment date strings into date objects and sort entire list by date
    for (let assignment of this.assignments) {
      assignment.availability.adaptiveRelease.end = new Date(assignment.availability.adaptiveRelease.end)
    }
    this.assignments.sort((a: Assignment, b: Assignment) => {
      return (a.availability.adaptiveRelease.end.getTime() <= b.availability.adaptiveRelease.end.getTime() ? -1 : 1);
    });
  }

  /**
   * Calculates the start of the week of the given date as defined by midnight of that week's Monday.
   * @param currentDate Any date
   * @returns 12:00am on Monday of the provided date's corresponding week.
   */
  getWeekStart(currentDate: Date): Date {
    currentDate.setHours(0, 0, 0, 0);
    const difference = currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1);
    return new Date(currentDate.setDate(difference))
  }


  // PERSISTENT

  /**
   * Populates weekAssignments with all assignments due during the currently-selected week.
   */
  organizeWeekAssignments() {
    this.weekAssignments = [[], [], [], [], [], [], []]
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

  /**
   * Moves calendar page forward by one week.
   */
  pageForward() {
    this.weekStart.setDate(this.weekStart.getDate() + 7);
    this.pageNumber++;
    this.organizeWeekAssignments();
  }

  /**
   * Moves calendar page back by one week
   */
  pageBack() {
    this.weekStart.setDate(this.weekStart.getDate() - 7);
    this.pageNumber--;
    this.organizeWeekAssignments();
  }

  /**
   * Resets calendar page to the current week.
   */
  reset() {
    this.weekStart = this.getWeekStart(new Date(Date.now()));
    this.pageNumber = 0;
    this.organizeWeekAssignments();
  }

  // TODO implement logic to disable previous/next buttons at beginning/end of semester
}
