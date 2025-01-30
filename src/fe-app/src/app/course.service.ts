import { Injectable } from '@angular/core';
import { Course } from './course';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  url = 'https://classmate.osterholt.us/api/';

  private selectIndex: number = -1;    // Index of course selected in array; -1 indicates none

  constructor() { }

  async getCourses(userId: string | null) : Promise<Course[]> {
    const response = await fetch(`${this.url}getCourses?userId=${userId}`);
    const data = await response.json() ?? [];

    if(Array.isArray(data) && data.length === 0) {
      throw new Error('courses are []');
    }

    console.log(data);
    return data;
  } catch (error: any) {
    console.error('Error fetching courses:', error);
    throw error;
  }

  // Returns the ID of the currently-selected course
  getSelectIndex(): number {
    return this.selectIndex;
  }

  // Updates the currently-selected course ID
  selectCourse(index: number): void {
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
