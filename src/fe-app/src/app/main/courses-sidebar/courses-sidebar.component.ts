import { Component, ChangeDetectorRef } from '@angular/core';
import { Course } from '../../course';
import { CourseService } from '../../course.service';
import { AssignmentService } from '../../assignment.service';
import { LoginService } from '../../login.service';

@Component({
    selector: 'app-courses-sidebar',
    imports: [],
    templateUrl: './courses-sidebar.component.html',
    styleUrl: './courses-sidebar.component.css'
})
export class CoursesSidebarComponent {
  courses: Course[] = [];

  constructor(
    protected courseService: CourseService,
    private assignmentService: AssignmentService,
    private loginService: LoginService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Retrieve course list from CourseService and store it in courses
    this.courseService.getCourses(this.loginService.getUserId())
    .then((courses: Course[]) => {
      this.courses = courses;
    });

    // Ensure no course is selected on page load
    //this.courseService.deselectCourse();
  }

  selectCourse(index: number): void {
    if (index === this.courseService.getSelectIndex())
      this.courseService.deselectCourse();
    else {
      this.courseService.selectCourse(index);
      console.log("Selected Course ID: " + this.courses[index].id);
    }
    this.assignmentService.incrementUpdateSignal();
  }

  getStyle(index: number): string {
    return index === this.courseService.getSelectIndex() ? "course selected" : "course";
  }
}
