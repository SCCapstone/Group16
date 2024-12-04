import { Component, inject } from '@angular/core';
import { Course } from '../../course';
import { CourseService } from '../../course.service';
import { LoginService } from '../../login.service';

@Component({
  selector: 'app-courses-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './courses-sidebar.component.html',
  styleUrl: './courses-sidebar.component.css'
})
export class CoursesSidebarComponent {
  courseService = inject(CourseService);
  loginService = inject(LoginService);

  courses: Course[] = [];

  constructor() {
    // Retrieve course list from CourseService and store it in courses
    this.courseService.getCourses(this.loginService.getUserId())
    .then((courses: Course[]) => {
      this.courses = courses;
    })

    // Ensure no course is selected on page load
    this.courseService.deselectCourse();
  }

  // Updates selectIndex to clicked-on course or deselects it if already selected
  selectCourse(index: number): void {
    if (index === this.courseService.getSelectIndex())
      this.courseService.deselectCourse();
    else
      this.courseService.selectCourse(index);
  }

  // Returns CSS class for the given index based on whether or not it is selected
  getStyle(index: number): string {
    if (index === this.courseService.getSelectIndex())
      return "course selected";
    return "course";
  }
}
