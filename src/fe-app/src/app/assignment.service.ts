import { core } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Assignment } from './assignment';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  url = 'https://osterholt.us/api/getAssignments';
  url2 = 'https://osterholt.us/api/createAssignmentWithoutId';

  //https://osterholt.us/addAssignmentWithoutId?title=Assignment+1&description=Test+Description&dueDate=2024-12-10&userId=123&courseId=456


  constructor() { }

  async getAssignments(userId: string | null) : Promise<Assignment[]> {
    const response = await fetch(`${this.url}?userId=${userId}`);
    const data = await response.json() ?? [];
    console.log(data);
    return data;
  }

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

      const response = await fetch(`${this.url2}?${queryParams}`, {
        method: 'POST'
      });

      if(!response.ok) {
        throw new Error(`POST failed: ${response.status}`)
      }

      console.log(response)
  }
}
