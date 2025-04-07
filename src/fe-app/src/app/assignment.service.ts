import { core } from '@angular/compiler';
import { inject, Injectable, signal, WritableSignal, ChangeDetectorRef } from '@angular/core';

import { LoginService } from './login.service';
import { Assignment } from './course';

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  readonly url = 'https://classmate.osterholt.us/api/';
  private loginService = inject(LoginService);

  private assignments: Assignment[] = [];
  private static readonly VIEW_COMPLETED_KEY = 'viewCompleted';

  // Used to signal that the assignment list has been updated; components watching this signal can then act as desired.
  private signalValue: number = 0;
  private updateSignal: WritableSignal<number> = signal<number>(this.signalValue);

  constructor() {}

  ngOnInit() {
    if (this.loginService.getUserId()) {
      this.fetchAssignments(this.loginService.getUserId())
      .then((assignments: Assignment[]) => {
        this.assignments = assignments;
        this.updateSignal.set(++this.signalValue);  // Update signal so components know to grab data
      })
    }
  }

  // Returns assignment service's signal so that components may watch it for changes
  getUpdateSignal() {
    return this.updateSignal();
  }

  async getAssignments(userId: string | null): Promise<Assignment[]> {
    if (userId === this.loginService.getUserId()) {
      if (this.assignments.length === 0)
        this.assignments = await this.fetchAssignments(userId);
      return this.assignments;
    }
    return [];
  }

  async fetchAssignments(userId: string | null) : Promise<Assignment[]> {
    try {
      const response = await fetch(`${this.url}getAssignments?userId=${userId}`);
      const data = await response.json() ?? [];

      if(Array.isArray(data) && data.length === 0) {
        throw new Error('assignments are []');  // TODO doesn't this just break when a user has no assignments? probably shouldn't do that
      }
      return data;
    }
    catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching assignments:', error.message);
      } else {
        console.error('Unexpected error', error);
      }
      throw error;
    }
 }

  getViewCompleted(): boolean {
    return localStorage.getItem(AssignmentService.VIEW_COMPLETED_KEY) === 'true';
  }

  toggleViewCompleted() {
    const newValue = !this.getViewCompleted();
    localStorage.setItem(AssignmentService.VIEW_COMPLETED_KEY, String(newValue));
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
    catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching assignment:', error.message);
      } else {
        console.error('Unexpected error', error);
      }
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
        title: title ?? "NULL",
        description: description ?? "",
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

        const assignment: Assignment = await response.json() ?? {};

        this.assignments.push(assignment);
        this.updateSignal.set(++this.signalValue);  // Notify observing components that data has updated
      }
      catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error adding task:', error.message);
        } else {
          console.error('Unexpected error', error);
        }
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error editing task:', error.message);
      } else {
        console.error('Unexpected error', error);
      }
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

      // Update assignment in stored array and update signal for components
      for (let assignment of this.assignments) {
        if (assignment.id === assignmentId && assignment.complete === false)
          assignment.complete = true;
      }
      this.updateSignal.set(++this.signalValue);
    }
    catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error completing task:', error.message);
      } else {
        console.error('Unexpected error', error);
      }
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
      
      // Update assignment in stored array and update signal for components
      for (let assignment of this.assignments) {
        if (assignment.id === assignmentId && assignment.complete === true)
          assignment.complete = true;
      }
      this.updateSignal.set(++this.signalValue);
    }
    catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error opening task:', error.message);
      } else {
        console.error('Unexpected error', error);
      }
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

    } catch(error: unknown) {
      if (error instanceof Error) {
        console.error('Error removing task:', error.message);
      } else {
        console.error('Unexpected error', error);
      }
      throw error;
    }

    for (let i=0; i < this.assignments.length; i++) {
      if (this.assignments[i].id === assignmentId) {
        this.assignments.splice(i, 1);
        break;
      }
    }
    this.updateSignal.set(++this.signalValue);
  }

  /**
   * Resets the service variables so that information is not preserved across logins.
   */
  reset() {
    this.assignments = []
    localStorage.removeItem('viewCompleted');
  }
}
