import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Assignment, Course, Grade } from '../../course';
import { GradesService } from '../../grades.service';
import { LoginService } from '../../login.service';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../course.service';
import { AssignmentService } from '../../assignment.service';
import { GradeCalcComponent } from "../../grade-calc/grade-calc.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-grades',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './grades.component.html',
  styleUrl: './grades.component.css'
})
export class GradesComponent {
  loginService = inject(LoginService);
  courseService = inject(CourseService)
  assignmentService = inject(AssignmentService)
  gradeService = inject(GradesService);
  updateGradeForm: FormGroup<{ [key: string]: FormControl<any> }> = new FormGroup({});

  courses: Course[] = [];
  assignments: Assignment[] = [];
  grades: Grade[] = [];

  constructor() {}

  ngOnInit() {
    this.courseService.getCourses(this.loginService.getUserId())
    .then((courses: Course[]) => {
      this.courses = courses;
    });

    this.assignmentService.getAssignments(this.loginService.getUserId()).then((assignments: Assignment[]) => {
      this.assignments = assignments;
    });

    this.gradeService.getGrades(this.loginService.getUserId())
    .then((grades: Grade[]) => {
      this.grades = grades;

      const gradeControls: { [key: string]: FormControl } = {};  // Make sure this is typed correctly

      this.grades.forEach(grade => {
        if (grade.id) {  // Ensure the grade.id is defined
          const gradeControl = new FormControl(
            grade.percent === -1 ? null : grade.percent.toString(),  // Empty string for -1 to show placeholder
            Validators.required
          );

          gradeControls[grade.id] = gradeControl;
        }
      });

      this.updateGradeForm = new FormGroup(gradeControls);
    });
  }

  /**
   * Iterates over the user's courses and returns the name of the course matching the given ID.
   * @param id The ID of a course.
   * @returns The name of the course, or "unknown" if not found.
   */
  getCourseNameByID(id: string): string {
    //console.log("SEARCHING COURSES ARRAY OF SIZE " + this.courses.length)
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
   * Sanitizes the letter grade that should be displayed, only returning the letter if the grade percent is positive.
   * @param grade The grade object to be referenced.
   * @returns The output letter grade, accounting for ungraded assignments or null letter grades.
   */
  displayGradeChar(grade: Grade): string {
    if (grade.percent < 0 || grade.gradeChar == null)
      return "N/A";
    return grade.gradeChar;
  }

  async setGrade(gradeId: string | undefined) {
    if (gradeId === undefined) {
      return;
    }

    const percent: number = this.updateGradeForm.value[gradeId];
    if (percent < 0 || percent === undefined || percent === null) {
      return;
    }

    const assignment = this.getAssignmentByID(this.grades.find(g => g.id === gradeId)?.assignmentId || '');
    if (!assignment?.userCreated) {
      return;
    }

    const gradeToUpdate = this.grades.find(grade => grade.id === gradeId);
    if (gradeToUpdate && gradeToUpdate.percent == percent) {
      return;
    }

    if (gradeToUpdate) {
      gradeToUpdate.percent = percent;
      gradeToUpdate.gradeChar = this.calculateGradeChar(percent);
      this.updateGradeForm.patchValue({ [gradeId]: percent.toString() });
    }

    try {
      await this.gradeService.setGrade(gradeId, percent);
      console.log(`Grade ${gradeId} updated successfully.`);
    } catch (error) {
      console.error(`Error updating grade ${gradeId}:`, error);
    }
  }

  // This function calculates the letter grade based on the percent
  calculateGradeChar(percent: number): string {
    if (percent >= 90)
      return "A";
    else if (percent >= 86)
      return "B+";
    else if (percent >= 80)
      return "B";
    else if (percent >= 76)
      return "C+";
    else if (percent >= 70)
      return "C";
    else if (percent >= 66)
      return "D+";
    else if (percent >= 60)
      return "D";
    else
      return "F";
  }

  setGradeOnEvent(event: Event, gradeId: string | undefined) {
    if (!gradeId) return;

    // Prevent default form behavior on Enter key
    if (event instanceof KeyboardEvent && event.key === "Enter") {
      event.preventDefault();
    }

    this.setGrade(gradeId);

    const target = event.target as HTMLInputElement;
    target.blur();
  }

  getAssignmentByID(id: string): Assignment | undefined {
    return this.assignments.find(assignment => assignment.id === id);
  }
}
