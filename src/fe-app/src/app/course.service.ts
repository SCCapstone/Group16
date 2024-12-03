import { Injectable } from '@angular/core';
import { Course } from './course';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  url = 'http://104.234.231.191:1616/api/getCourses';

  private selectedCourse: string = "";    // ID of course selected in CoursesSidebarComponent

  constructor() { }

  async getCourses(userId: string | null) : Promise<Course[]> {
    const response = await fetch(`${this.url}?userId=${userId}`);
    const data = await response.json() ?? [];
    console.log(data);
    return data;
  }

  // Returns the ID of the currently-selected course
  getSelectedCourse(): string {
    return this.selectedCourse;
  }

  // Updates the currently-selected course ID
  selectCourse(courseID: string): void {
    if (courseID === this.selectedCourse)
      this.selectedCourse = "";
    else
      this.selectedCourse = courseID;
  }

  // Clears course selection; used while initializing a page
  deselectCourse(): void {
    this.selectedCourse = "";
  }
}
