import { Injectable } from '@angular/core';
import { Course } from './course';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  url = 'https://osterholt.us/api/getCourses';

  private selectIndex: Number = -1;    // Index of course selected in array; -1 indicates none

  constructor() { }

  async getCourses(userId: string | null) : Promise<Course[]> {
    const response = await fetch(`${this.url}?userId=${userId}`);
    const data = await response.json() ?? [];
    console.log(data);
    return data;
  }

  // Returns the ID of the currently-selected course
  getSelectIndex(): Number {
    return this.selectIndex;
  }

  // Updates the currently-selected course ID
  selectCourse(index: Number): void {
    if (index === this.selectIndex)
      this.selectIndex = -1;
    else
      this.selectIndex = index;
  }

  // Clears course selection; used while initializing a page
  deselectCourse(): void {
    this.selectIndex = -1;
  }
}
