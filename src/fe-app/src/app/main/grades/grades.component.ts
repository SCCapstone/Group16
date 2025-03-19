import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Assignment, Course, Grade } from '../../course';
import { GradesService } from '../../grades.service';
import { LoginService } from '../../login.service';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../course.service';
import { AssignmentService } from '../../assignment.service';
import { GradeCalcComponent } from "../../grade-calc/grade-calc.component";

@Component({
  selector: 'app-grades',
  standalone: true,
  imports: [RouterModule, CommonModule, GradeCalcComponent],
  templateUrl: './grades.component.html',
  styleUrl: './grades.component.css'
})
export class GradesComponent {
  loginService = inject(LoginService);
  courseService = inject(CourseService)
  assignmentService = inject(AssignmentService)
  gradeService = inject(GradesService);

  courses: Course[] = [];
  assignments: Assignment[] = [];
  grades: Grade[] = [];

  showPopup = false;
  popupType: 'calculator' | null = null;

  constructor() {
    this.courseService.getCourses(this.loginService.getUserId())
    .then((courses: Course[]) => {
      this.courses = courses;
    })

    this.assignmentService.getAssignments(this.loginService.getUserId()).then((assignments: Assignment[]) => {
      this.assignments = assignments;
    })

    this.gradeService.getGrades(this.loginService.getUserId())
    .then((grades: Grade[]) => {
      this.grades = grades;
    })
  }

  /**
   * Iterates over the user's courses and returns the name of the course matching the given ID.
   * @param id The ID of a course.
   * @returns The name of the course, or "unknown" if not found.
   */
  getCourseNameByID(id: string): string {
    console.log("SEARCHING COURSES ARRAY OF SIZE " + this.courses.length)
    for (const course of this.courses) {
      if (course.id === id)
        return course.name.split('-')[0];
    }
    return  "unknown";
  }

  /**
   * Iterates over the user's assignments and returns the name of the course matching the given ID.
   * @param id The ID of an assignment.
   * @returns The name of the assignment, or "unknown" if not found.
   */
  getAssignmentTitleByID(id: string): string {
    for (const assignment of this.assignments) {
      if (assignment.id === id)
        return assignment.title
    }
    return "unknown";
  }

  /**
   * Takes in a grade value and returns it in the correct format for display.
   * @param grade A decimal, percent-based grade.
   * @returns A string adding a % sign to the given grade, or -- if it is negative
   */
  displayGrade(grade: number): string {
    if (grade < 0)
      return "--";
    return ("" + grade + "%");
  }

  /**
   * Sanitizes the letter grade that should be displayed, only returning the letter if the grade percent is positive.
   * @param grade The grade object to be referenced.
   * @returns The output letter grade, accounting for ungraded assignments or null letter grades.
   */
  displayGradeChar(grade: Grade): string {
    if (grade.percent < 0 || grade.gradeChar == null)
      return "N/A";
    return grade.gradeChar;
  }

  openPopup(type: 'calculator'): void {
    this.popupType = type;
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false;
    this.popupType = null;
  }
}
