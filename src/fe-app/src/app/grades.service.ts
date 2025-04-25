import { Injectable, WritableSignal, signal } from '@angular/core';
import { Grade } from './course';

@Injectable({
  providedIn: 'root'
})
export class GradesService {
  readonly url = 'https://classmate.osterholt.us/api/';

  private signalValue: boolean = false;
  private updateSignal: WritableSignal<boolean> = signal<boolean>(this.signalValue);

  constructor() { }

  getUpdateSignal() {
    return this.updateSignal();
  }

  /**
   * API call to get all grades for a user
   * @param userId
   * @returns Grade[] : an array of grades for the user
   */
  async getGrades(userId: string | null) : Promise<Grade[]> {
    const response = await fetch(`${this.url}getGrades?userId=${userId}`);
    const data = await response.json() ?? [];

    if(Array.isArray(data) && data.length === 0) {
      throw new Error('grades are []');
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching assignments:', error.message);
    } else {
      console.error('Unexpected error', error);
    }
    throw error;
  }

  /**
   * API call that sets the grade for a specific assignment
   * @param gradeId
   * @param percent
   */
  async setGrade(gradeId: string | null, percent: number | null) : Promise<void> {
    const queryParams = new URLSearchParams({
      gradeId: gradeId ?? "NULL",
      percent: percent?.toString() ?? "NULL"
    }).toString();

    try {
      const response = await fetch(`${this.url}setGrade?${queryParams}`, {
        method: 'POST'
      });

      if(!response.ok) {
        throw new Error(`POST failed: ${response.status}`)
      }

      this.signalValue = !this.signalValue;
      this.updateSignal.set(this.signalValue);

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
