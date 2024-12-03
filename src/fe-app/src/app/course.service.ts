import { Injectable } from '@angular/core';
import { Course } from './course';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  url = 'https:/osterholt.us/api/getCourses';

  constructor() { }

  async getCourses(userId: string | null) : Promise<Course[]> {
    const response = await fetch(`${this.url}?userId=${userId}`);
    const data = await response.json() ?? [];
    console.log(data);
    return data;
  }
}
