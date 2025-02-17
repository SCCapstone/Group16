import { core } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Assignment } from './course';

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  readonly url = 'https://classmate.osterholt.us/api/';

  private viewCompleted: boolean;

  constructor() {
    this.viewCompleted = false;
  }

  getViewCompleted(): boolean {
    return this.viewCompleted;
  }

  toggleViewCompleted() {
    this.viewCompleted = !this.viewCompleted;
  }

  async getAssignments(userId: string | null) : Promise<Assignment[]> {
     try {
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
  }

  async getAssignmentById(assignmentId: string | null) : Promise<Assignment> {
    try {
      const response = await fetch(`${this.url}getAssignmentById?assignmentId=${assignmentId}`);
      const data = await response.json() ?? {};

      if(Object.keys(data).length === 0) {
        throw new Error('assignment is {}');
      }

      console.log(data);
      return data;
    } catch (error: any) {
      console.error('Error fetching assignment:', error);
      throw error;
    }
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

  async editTask(title: string | null, description: string | null, dueDate: Date | null,
    userId: string | null, courseId : string | null, assignmentId: string | null) {
      const queryParams = new URLSearchParams({
        userId: userId ?? "NULL",
        courseId: courseId ?? "NULL",
        assignmentId: assignmentId ?? "NULL",
        title: title ?? "NULL",
        description: description ?? "NULL",
        dueDate: dueDate?.toISOString() ?? "NULL"
      }).toString();

      console.log(queryParams);
      try {
        const response = await fetch(`${this.url}editAssignment?${queryParams}`, {
          method: 'PUT'
        });

        if(!response.ok) {
          throw new Error(`PUT failed: ${response.status}`)
        }

        console.log(response);
      } catch (error: any) {
        console.error('Error editing task:', error);
        throw error;
      }
    }

    async completeTask(assignmentId: string | null) {
      const queryParams = new URLSearchParams({
        assID: assignmentId ?? "NULL"
      }).toString();

      console.log(queryParams);
      try {
        const response = await fetch(`${this.url}completeAssignment?${queryParams}`, {
          method: 'PUT'
        });

        if(!response.ok) {
          throw new Error(`PUT failed: ${response.status}`)
        }

        console.log(response);
      } catch (error: any) {
        console.error('Error completing task:', error);
        throw error;
      }
    }

    async openTask(assignmentId: string | null) {
      const queryParams = new URLSearchParams({
        assID: assignmentId ?? "NULL"
      }).toString();

      console.log(queryParams);
      try {
        const response = await fetch(`${this.url}openAssignment?${queryParams}`, {
          method: 'PUT'
        });

        if(!response.ok) {
          throw new Error(`PUT failed: ${response.status}`)
        }

        console.log(response);
      } catch (error: any) {
        console.error('Error opening task:', error);
        throw error;
      }
    }
}
