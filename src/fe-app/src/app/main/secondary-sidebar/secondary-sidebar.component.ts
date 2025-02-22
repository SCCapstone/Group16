import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { LoginService } from '../../login.service';
import { CourseService } from '../../course.service';
import { GradesService } from '../../grades.service';
import { Course, Assignment, Grade } from '../../course';

@Component({
  selector: 'app-secondary-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './secondary-sidebar.component.html',
  styleUrls: ['./secondary-sidebar.component.css']
})
export class SecondarySidebarComponent implements OnChanges {
  @Input() assignments: Assignment[] = [];

  // TODO refactor so that main passes courses into sidebar components rather than making service calls in each one (where applicable)
  courses: Course[] = [];
  grades: Grade[] = [];

  loginService = inject(LoginService)
  courseService = inject(CourseService);
  gradesService = inject(GradesService);
  router = inject(Router);

  ngOnChanges(changes: SimpleChanges) {}

  constructor() {
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
    return String(sum / count);
  }
}
