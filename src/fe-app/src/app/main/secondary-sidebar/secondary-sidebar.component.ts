import { Component, inject, Input, OnChanges, SimpleChanges, effect, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { LoginService } from '../../login.service';
import { CourseService } from '../../course.service';
import { AssignmentService } from '../../assignment.service';
import { GradesService } from '../../grades.service';
import { Course, Assignment, Grade } from '../../course';

@Component({
    selector: 'app-secondary-sidebar',
    imports: [CommonModule],
    templateUrl: './secondary-sidebar.component.html',
    styleUrls: ['./secondary-sidebar.component.css']
})
export class SecondarySidebarComponent implements OnChanges {
  courses: Course[] = [];
  assignments: Assignment[] = [];
  grades: Grade[] = [];

  loginService = inject(LoginService)
  courseService = inject(CourseService);
  // assignmentService = inject(AssignmentService);
  gradesService = inject(GradesService);
  router = inject(Router);

  ngOnChanges(changes: SimpleChanges) {}

  constructor(private assignmentService: AssignmentService, private cdr: ChangeDetectorRef) {

    // Set logic to run whenever the AssignmentService signal updates (e.g. its constructor finishes or an assignment is added)
    effect(() => {
      const signal = this.assignmentService.getUpdateSignal();  // Referencing the signal is necessary for it to work

      // Runs when service constructor finishes, no need to call twice
      this.assignmentService.getAssignments(this.loginService.getUserId()).then((assignments: Assignment[]) => {
        this.filterTopThree(assignments)
        this.cdr.detectChanges();
      });
    });

    // Set logic to run whenever the GradesService signal updates (for when a grade is updated)
    effect(() => {
      const signal = this.gradesService.getUpdateSignal();

      this.gradesService.getGrades(this.loginService.getUserId())
      .then((grades: Grade[]) => {
        this.grades = grades;
      })
    })
  }

  ngOnInit() {
    this.courseService.getCourses(this.loginService.getUserId())
    .then((courses: Course[]) => {
      this.courses = courses;
    })

    this.gradesService.getGrades(this.loginService.getUserId())
    .then((grades: Grade[]) => {
      this.grades = grades;
    })
  }

  /**
   * Takes in a list of assignments and returns a list of three incomplete assignments with the closest due dates
   * @param assignments
   */
  filterTopThree(assignments: Assignment[]) {
    let candidates: Assignment[] = [];
    const courseIndex = this.courseService.getSelectIndex();
    const now = new Date();

    for (const assignment of assignments) {
      const endDate = new Date(assignment.availability.adaptiveRelease.end);

      if (!assignment.complete && endDate >= now && (courseIndex === -1 || assignment.courseId === this.courses[courseIndex].id))
        candidates.push(assignment);
    }
    candidates.sort((a: Assignment, b: Assignment) => {
      return new Date(a.availability.adaptiveRelease.end).getTime() - new Date(b.availability.adaptiveRelease.end).getTime();
    })

    this.assignments = candidates.slice(0, 3);
  }

  /**
   * Takes in a course ID and returns the average of every grade associated with that course.
   * It should be noted that weights are not supported because Blackboard itself does not support grade weighting.
   * @param courseID The ID of the course to calculate the final grade for.
   * @returns The unweighted average of all assignments related to the given course.
   */
  calculateFinalGrade(courseID: string): string {
    let sum: number = 0, count: number = 0;
    for (const grade of this.grades) {
      if (grade.courseId == courseID && grade.percent >= 0) {
        sum += grade.percent;
        count++;
      }
    }

    if (count == 0)
      return "--";

    const average = sum / count;
    return (average % 1 === 0) ? average + "%" : average.toFixed(2) + "%";
  }
}
