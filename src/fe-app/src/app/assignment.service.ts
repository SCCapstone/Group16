import { Injectable } from '@angular/core';
import { Assignment } from './assignment';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  url = 'http://104.234.231.191:1616/api/getAssignments';

  constructor() { }

  async getAssignments(userId: string | null) : Promise<Assignment[]> {
    const response = await fetch(`${this.url}?userId=${userId}`);
    const data = await response.json() ?? [];
    console.log(data);
    return data;
  }
}
