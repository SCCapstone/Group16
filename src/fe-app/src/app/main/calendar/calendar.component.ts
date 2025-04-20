import { Component, inject, effect, ChangeDetectorRef } from '@angular/core';

import { LoginService } from '../../login.service';
import { CourseService } from '../../course.service';
import { AssignmentService } from '../../assignment.service';
import { CommonModule } from '@angular/common';
import { Course } from '../../course';
import { Assignment } from '../../course';

@Component({
    selector: 'app-calendar',
    imports: [CommonModule],
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.css'
})
export class CalendarComponent {
  weekStart: Date;                  // Start of the currently-selected week
  pageNumber: number;               // Offset from current week in number of weeks
  semesterStart: Date;              // Start of the first week of the current semester
  semesterEnd: Date;                // Start of the week after the end of the current semester

  courses: Course[] = [];
  assignments: Assignment[] = [];
  weekAssignments: Assignment[][] = [[], [], [], [], [], [], []];

  showPopup: boolean = false;
  openAssignment: Assignment | null = null;
  readonly ASSIGNMENT_COLORS: String[] = ["red", "orange", "yellow", "green", "blue", "purple", "brown", "gray"];

  loginService = inject(LoginService);
  courseService = inject(CourseService);

  readonly DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // INITIALIZATION

  constructor(private assignmentService: AssignmentService, private cdr: ChangeDetectorRef) {
    const now: Date = new Date(Date.now());
    this.weekStart = this.getWeekStart(now);  // Store start of the current week
    this.pageNumber = 0;

    // Find start and end of semesters (really lazy method but magic strings should work)
    if (now.getMonth() < 8) {
      this.semesterStart = new Date("January 15, " + now.getFullYear());
      this.semesterEnd = new Date("May 7, " + now.getFullYear());
    }
    else {
      this.semesterStart = new Date("August 22, " + now.getFullYear());
      this.semesterEnd = new Date("December 18, " + now.getFullYear());
    }
    this.semesterStart = this.getWeekStart(this.semesterStart);
    this.semesterEnd = this.getWeekStart(this.semesterEnd);
    this.semesterEnd.setDate(this.semesterEnd.getDate() + 7);

    // Set logic to run whenever the AssignmentService signal updates (e.g. its constructor finishes or an assignment is added)
    effect(() => {
      const signal = this.assignmentService.getUpdateSignal();  // Referencing the signal is necessary for it to work

      // Runs when service constructor finishes, no need to call twice
      this.loadAssignments().then(() => {
        this.organizeWeekAssignments();
      });
    })
  }

  ngOnInit() {
    this.courseService.getCourses(this.loginService.getUserId())
    .then((courses: Course[]) => {
      this.courses = courses;
    })
  }

  /**
   * Retrieves and sorts all assignments from AssignmentService and stores in "assignments"
   */
  async loadAssignments() {
    this.assignments = await this.assignmentService.getAssignments(this.loginService.getUserId());

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

      if (difference < 0)
        continue;
      if (difference >= 7 * millisecondsPerDay)
        break;
      
      this.weekAssignments[Math.floor(difference / millisecondsPerDay)].push(assignment);
    }
  }

  /**
   * Calculates the day of the month from the start of the currently-selected week and an integer offset
   * @param offset Offset from this.weekStart in number of days
   */
  calculateDateWithOffset(offset: number): number {
    let weekStartCopy = new Date(this.weekStart);
    weekStartCopy.setDate(weekStartCopy.getDate() + offset);
    return weekStartCopy.getDate();
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

  /**
   * Check if the given date falls within the first week of the current semester.
   * @param date The date to check
   * @return true if given date comes first, false otherwise
   */
  checkSemesterStart(date: Date): Boolean {
    let dateCopy = this.getWeekStart(date);
    dateCopy.setDate(dateCopy.getDate() - 7);
    if (dateCopy < this.semesterStart)
      return true;
    return false;
  }

  /**
   * Check if the given date falls within the last week of the current semester.
   * @param date The date to check
   * @return true if given date comes last, false otherwise
   */
  checkSemesterEnd(date: Date): Boolean {
    let dateCopy = this.getWeekStart(date);
    dateCopy.setDate(dateCopy.getDate() + 7);
    if (dateCopy >= this.semesterEnd)
      return true;
    return false;
  }

  /**
   * Returns the index of the course matching the given courseID
   * @param courseID The courseID property of an assignment
   * @return The index of the corresponding course, or -1 if none found.
   */
  getCourseIndexByID(courseID: String | null): number {
    if (typeof courseID === null)
      return -1;
    for (let i=0; i < this.courses.length; i++) {
      if (this.courses[i].id === courseID)
        return i
    }
    return -1;
  }
  
  /**
   * Returns the course name of the course matching the given courseID
   * @param courseID The courseID property of an assignment
   * @return The name only (ex. "CSCE 355") of the corresponding course, or "unknown" if none found.
   */
  getCourseNameByID(courseID: String | null): String {
    const courseIndex = this.getCourseIndexByID(courseID);
    if (courseIndex < 0 || courseIndex >= this.courses.length)
      return "unknown";
    return this.courses[courseIndex].name.split('-')[0];
  }

  /**
   * Returns the color for a calendar item based on the given course ID
   * @param courseID The associated course ID of an assignment
   * @returns "background-color: <hex_code>", or "" if course not found
   */
  getStyleColorByID(courseID: String | null): String {
    const courseIndex = this.getCourseIndexByID(courseID);
    if (courseIndex < 0 || courseIndex >= this.courses.length || courseIndex >= this.ASSIGNMENT_COLORS.length)
      return "";
    return "background-color: " + this.ASSIGNMENT_COLORS[courseIndex];
  }

  /**
   * Checks if an assignment should be marked as past due on the calendar.
   * @param assignment The assignment to check
   * @return true if assignment is incomplete and past due, false otherwise
   */
  checkPastDue(assignment: Assignment): boolean {
    return (!assignment.complete && assignment.availability.adaptiveRelease.end.getTime() <= Date.now())
  }

  /**
   * open the edit task or task popup
   * @param assignment The assignment clicked on by the user
   */
  openPopup(assignment: Assignment): void {
    this.showPopup = true;
    this.openAssignment = assignment;
    document.addEventListener('keydown', this.handleEscapeKey);
  }

  /**
   * close the popup
   */
  closePopup(): void {
    this.showPopup = false;
    this.openAssignment = null;
    document.removeEventListener('keydown', this.handleEscapeKey);
  }

  /**
   * close the popup when the escape key is pressed
   * @param event
   */
  private handleEscapeKey = (event: KeyboardEvent): void => {
    if (event.key === 'Escape')
      this.closePopup();
  }

  /**
   * close the popup when the backdrop is clicked
   * @param event
   */
  handleBackdropClick(): void {
    this.closePopup();
  }
}
