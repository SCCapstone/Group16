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
  selectIndex: Number = -1;   // Index of course selected by user; -1 indicates none

  courseService = inject(CourseService);
  loginService = inject(LoginService);

  constructor() {
    this.courseService.getCourses(this.loginService.getUserId())
    .then((courses: Course[]) => {
      this.courses = courses;
    })
  }

  selectCourse(index: Number): void {
    if (index === this.selectIndex)
      this.selectIndex = -1;
    else
      this.selectIndex = index;

    console.log("Selected course index " + this.selectIndex);
  }
}
