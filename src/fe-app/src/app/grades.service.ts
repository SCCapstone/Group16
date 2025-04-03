import { Injectable } from '@angular/core';
import { Grade } from './course';

@Injectable({
  providedIn: 'root'
})
export class GradesService {
  readonly url = 'https://classmate.osterholt.us/api/';

  constructor() { }

  async getGrades(userId: string | null) : Promise<Grade[]> {
    const response = await fetch(`${this.url}getGrades?userId=${userId}`);
    const data = await response.json() ?? [];

    if(Array.isArray(data) && data.length === 0) {
      throw new Error('grades are []');
    }

    console.log(data);
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching assignments:', error.message);
    } else {
      console.error('Unexpected error', error);
    }
    throw error;
  }

  async setGrade(gradeId: string | null, percent: number | null) : Promise<void> {
      const queryParams = new URLSearchParams({
        gradeId: gradeId ?? "NULL",
        percent: percent?.toString() ?? "NULL"
      }).toString();

      console.log(queryParams);

      try {
        const response = await fetch(`${this.url}setGrade?${queryParams}`, {
          method: 'POST'
        });

        if(!response.ok) {
          throw new Error(`POST failed: ${response.status}`)
        }

        console.log(response);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error setting grade:', error.message);
        } else {
          console.error('Unexpected error', error);
        }
        throw error;
      }
  }
}
