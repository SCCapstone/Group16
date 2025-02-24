import { core } from '@angular/compiler';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';

import { LoginService } from './login.service';
import { Assignment } from './course';

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  readonly url = 'https://classmate.osterholt.us/api/';
  private loginService = inject(LoginService);

  private assignments: Assignment[] = [];
  private viewCompleted: boolean;

  // Used to signal that the assignment list has been updated; components watching this signal can then act as desired.
  private signalValue: number = 0;
  private updateSignal: WritableSignal<number> = signal<number>(this.signalValue);

  constructor() {
    this.viewCompleted = false;
    this.fetchAssignments(this.loginService.getUserId())
    .then((assignments: Assignment[]) => {
      this.assignments = assignments;
      this.updateSignal.set(++this.signalValue);  // Update signal so components know to grab data
    })
  }

  // Returns assignment service's signal so that components may watch it for changes
  getUpdateSignal() {
    return this.updateSignal;
  }

  async getAssignments(userId: string | null): Promise<Assignment[]> {
    if (userId === this.loginService.getUserId()) {
      if(this.assignments.length === 0) {
        await this.fetchAssignments(userId)
      }
      return this.assignments;
    }
    return [];
  }

  async fetchAssignments(userId: string | null) : Promise<Assignment[]> {
    try {
      const response = await fetch(`${this.url}getAssignments?userId=${userId}`);
      const data = await response.json() ?? [];

      if(Array.isArray(data) && data.length === 0) {
        throw new Error('assignments are []');
      }
      return data;
    }
    catch (error: any) {
      console.error('Error fetching assignments:', error);
      throw error;
    }
 }

  getViewCompleted(): boolean {
    return this.viewCompleted;
  }

  toggleViewCompleted() {
    this.viewCompleted = !this.viewCompleted;
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
    }
    catch (error: any) {
      console.error('Error fetching assignment:', error);
      throw error;
    }
  }

  /**
   * Posts a new task to the database and inserts it into the assignments array.
   * @param title Assignment title
   * @param description Assignment description
   * @param dueDate Date the assignment is due
   * @param userId ID of the user that the assignment was created for
   * @param courseId ID of the course associated with the assignment
   */
  async addTask(title: string, description: string, dueDate: Date, userId: string, courseId: string) : Promise<void> {
      const queryParams = new URLSearchParams({
        title: title,
        description: description ?? "",
        dueDate: dueDate?.toISOString(),
        userId: userId,
        courseId: courseId
      }).toString();

      console.log(queryParams);
      try {
        const response = await fetch(`${this.url}createAssignmentWithoutId?${queryParams}`, {
          method: 'POST'
        });
        if(!response.ok) {
          throw new Error(`POST failed: ${response.status}`)
        }

        //const dummyAssignment: Assignment = await response.json() ?? {};
        // Create dummy assignment with the given information to be inserted into list, will only exist until page reload
        const dummyAssignment: Assignment = {
          id: crypto.randomUUID(),
          userId: userId,
          courseId: courseId,
          title: title,
          description: description,
          availability: {
            adaptiveRelease: {
              end: dueDate
            }
          },
          complete: false,
          userCreated: false
        }
        this.assignments.push(dummyAssignment);
        this.updateSignal.set(++this.signalValue);  // Notify observing components that data has updated
      }
      catch (error: any) {
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
        description: description ?? "",
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

    async removeTask(assignmentId: string | null | undefined) {
      const queryParams = new URLSearchParams({
        assignmentId: assignmentId ?? "NULL"
      }).toString();

      try {
        const response = await fetch(`${this.url}removeAssignment?${queryParams}`, {
          method: 'DELETE'
        });

        if(!response.ok) {
          throw new Error(`DELETE failed: ${response.status}`)
        }

      } catch(error: any) {
        console.error('Error removing task: ', error);
        throw error;
      }
    }
}
