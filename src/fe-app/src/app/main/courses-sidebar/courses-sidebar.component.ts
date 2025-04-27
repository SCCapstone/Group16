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

  /**
   * Retrieves a list of courses from the CourseService and populate the component with them.
   * Note: ngOnInit is a lifecycle hook that is called when this component is initialized.
   */
  ngOnInit() {
    this.courseService.getCourses(this.loginService.getUserId())
    .then((courses: Course[]) => {
      this.courses = courses;
    });

    // Ensure no course is selected on page load
    //this.courseService.deselectCourse();
  }

  /**
   * Stores the given index as the selected course, or removes selection if given index is already stored.
   * @param index 
   */
  selectCourse(index: number): void {
    if (index === this.courseService.getSelectIndex())
      this.courseService.deselectCourse();
    else
      this.courseService.selectCourse(index);
    this.assignmentService.incrementUpdateSignal();
  }

  /**
   * Returns the CSS class(es) of the given course index for styling purposes.
   * @param index The index of a course in the course list.
   * @returns "course selected" if selected, "course" otherwise.
   */
  getStyle(index: number): string {
    return index === this.courseService.getSelectIndex() ? "course selected" : "course";
  }
}
