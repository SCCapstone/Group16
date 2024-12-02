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
  selectIndex: Number = -1;   // Index of course selected by user; -1 indicates none.

  // Retrieves course list from course service and stores it locally
  constructor() {
    this.courseService.getCourses(this.loginService.getUserId())
    .then((courses: Course[]) => {
      this.courses = courses;
    })
  }

  // Updates selectIndex to clicked-on course or deselects it if already selected
  selectCourse(index: Number): void {
    if (index === this.selectIndex)
      this.selectIndex = -1;
    else
      this.selectIndex = index;
  }

  // Returns CSS class for the given index based on whether or not it is selected
  getStyle(index: Number): string {
    if (index === this.selectIndex)
      return "course selected";     // Element in question will use both "course" and "selected" CSS classes
    return "course";
  }
}
