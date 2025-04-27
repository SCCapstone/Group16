import { Injectable } from '@angular/core';
import { Course } from './course';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  readonly url = 'https://classmate.osterholt.us/api/';

  private selectIndex: number;    // Index of course selected in array; -1 indicates none
  private readonly STORAGE_KEY = 'selectedCourseIndex';

  /**
   * Constructor for CourseService
   * - Initializes selectIndex from localStorage if available
   * - Otherwise, sets selectIndex to -1 (indicating no course is selected)
   */
  constructor() {
    const storedIndex = localStorage.getItem(this.STORAGE_KEY);
    this.selectIndex = storedIndex !== null ? parseInt(storedIndex, 10) : -1;
  }

  /**
   * API call that gets all courses for a user
   * @param userId
   * @returns Course[] : an array of courses for the user
   */
  async getCourses(userId: string | null) : Promise<Course[]> {
    try {
      const response = await fetch(`${this.url}getCourses?userId=${userId}`);
      const data = await response.json() ?? [];

      if(Array.isArray(data) && data.length === 0) {
        throw new Error('courses are []');
      }

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

  /**
   * API call that gets a specific course for a user
   * @param courseId
   * @returns Course : a course object for the user
   */
  async getCourseById(courseId: string | null) : Promise<Course> {
    try {
      const response = await fetch(`${this.url}getCourseById?courseId=${courseId}`);
      const data = await response.json() ?? {};

      if(Object.keys(data).length === 0) {
        throw new Error('course is {}');
      }

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

  /**
   * Returns the ID of the currently-selected course
   * @returns the index of the currently-selected course
   */
  getSelectIndex(): number {
    return this.selectIndex;
  }

  /**
   * Updates the currently-selected course ID
   * @param index
   */
  selectCourse(index: number): void {
    if (index === this.selectIndex)
      this.selectIndex = -1;
    else
      this.selectIndex = index;

    localStorage.setItem(this.STORAGE_KEY, this.selectIndex.toString());
  }

  /**
   * Clears course selection; used while initializing a page
   */
  deselectCourse(): void {
    this.selectIndex = -1;
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
