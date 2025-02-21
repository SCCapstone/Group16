import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Assignment, Course, Grade } from '../../course';
import { GradesService } from '../../grades.service';
import { LoginService } from '../../login.service';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../course.service';
import { AssignmentService } from '../../assignment.service';

@Component({
  selector: 'app-grades',
  standalone: true,
  imports: [RouterModule, CommonModule],
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

  constructor() {
    this.courseService.getCourses(this.loginService.getUserId())
    .then((courses: Course[]) => {
      this.courses = courses;
    })

    this.assignmentService.getAssignments(this.loginService.getUserId())
    .then((assignments: Assignment[]) => {
      this.assignments = assignments;
    })
    
    this.gradeService.getGrades(this.loginService.getUserId())
    .then((grades: Grade[]) => {
      this.grades = grades;
    })
  }

  getCourseNameByID(id: string): string {
    console.log("SEARCHING COURSES ARRAY OF SIZE " + this.courses.length)
    for (const course of this.courses) {
      if (course.id === id)
        return course.name.split('-')[0];
    }
    return  "Unknown";
  }

  getAssignmentTitleByID(id: string): string {
    for (const assignment of this.assignments) {
      if (assignment.id === id)
        return assignment.title
    }
    return "Unknown";
  }

  displayGrade(grade: number): string {
    if (grade < 0)
      return "--";
    return ("" + grade + "%");
  }
}
