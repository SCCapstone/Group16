import { core } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Assignment } from './course';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  url = 'https://classmate.osterholt.us/api/';

  constructor() { }

  async getAssignments(userId: string | null) : Promise<Assignment[]> {
    const response = await fetch(`${this.url}getAssignments?userId=${userId}`);
    const data = await response.json() ?? [];

    if(Array.isArray(data) && data.length === 0) {
      throw new Error('assignments are []');
    }

    console.log(data);
    return data;
  } catch (error: any) {
    console.error('Error fetching assignments:', error);
    throw error;
  }

  // In future adjust add task form to not work when any param is empty
  async addTask(title: string | null, description: string | null, dueDate: Date | null,
    userId: string | null, courseId : string | null) : Promise<void> {
      const queryParams = new URLSearchParams({
        title: title ?? "NULL",
        description: description ?? "NULL",
        dueDate: dueDate?.toISOString() ?? "NULL",
        userId: userId ?? "NULL",
        courseId: courseId ?? "NULL"
      }).toString();

      console.log(queryParams);
      try {
        const response = await fetch(`${this.url}createAssignmentWithoutId?${queryParams}`, {
          method: 'POST'
        });

        if(!response.ok) {
          throw new Error(`POST failed: ${response.status}`)
        }

        console.log(response);
      } catch (error: any) {
        console.error('Error adding task:', error);
        throw error;
      }
  }
}
