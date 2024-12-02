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
  courses: Course[] = [];
  courseService = inject(CourseService);
  loginService = inject(LoginService);

  constructor() {
    this.courseService.getCourses(this.loginService.getUserId())
    .then((courses: Course[]) => {
      this.courses = courses;
    })
  }
}
