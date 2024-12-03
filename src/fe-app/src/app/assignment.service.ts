import { Injectable } from '@angular/core';
import { Assignment } from './assignment';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  url = 'https://osterholt.us/api/getAssignments';

  constructor() { }

  async getAssignments(userId: string | null) : Promise<Assignment[]> {
    const response = await fetch(`${this.url}?userId=${userId}`);
    const data = await response.json() ?? [];
    console.log(data);
    return data;
  }
}
