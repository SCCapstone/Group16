import { Injectable } from '@angular/core';
import { Course } from './course';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  readonly url = 'https://classmate.osterholt.us/api/';

  private selectIndex: number;    // Index of course selected in array; -1 indicates none
  private readonly STORAGE_KEY = 'selectedCourseIndex';

  constructor() {
    const storedIndex = localStorage.getItem(this.STORAGE_KEY);
    this.selectIndex = storedIndex !== null ? parseInt(storedIndex, 10) : -1;
  }

  async getCourses(userId: string | null) : Promise<Course[]> {
    try {
      const response = await fetch(`${this.url}getCourses?userId=${userId}`);
      const data = await response.json() ?? [];

      if(Array.isArray(data) && data.length === 0) {
        throw new Error('courses are []');
      }

      console.log(data);
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching courses:', error.message);
      } else {
        console.error('Unexpected error', error);
      }
      throw error;
    }
  }

  async getCourseById(courseId: string | null) : Promise<Course> {
    try {
      const response = await fetch(`${this.url}getCourseById?courseId=${courseId}`);
      const data = await response.json() ?? {};

      if(Object.keys(data).length === 0) {
        throw new Error('course is {}');
      }

      console.log(data);
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching course:', error.message);
      } else {
        console.error('Unexpected error', error);
      }
      throw error;
    }
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

    localStorage.setItem(this.STORAGE_KEY, this.selectIndex.toString());
  }

  // Clears course selection; used while initializing a page
  deselectCourse(): void {
    this.selectIndex = -1;
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
