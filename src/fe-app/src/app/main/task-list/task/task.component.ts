import { Component, Input } from '@angular/core';
import { Assignment } from '../../../course';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AssignmentService } from '../../../assignment.service'; // Ensure the path is correct

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {
  @Input() assignment!: Assignment;
  
  constructor(private assignmentService: AssignmentService) {}
 
  async toggleCompletion(assignment: Assignment) {
    console.log("clicked");
    console.log(assignment.isComplete);
    try {
      const assignmentId = assignment.id ?? null;
      console.log(assignmentId);

      if (!assignmentId) {
        console.error('Assignment ID is missing!');
        return;
      }
  
      if (assignment.isComplete) {
        await this.assignmentService.openTask(assignmentId);
      } else {
        await this.assignmentService.completeTask(assignmentId);
      }
      console.log(assignment.isComplete);

      //assignment.isComplete = !assignment.isComplete;
  
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  }
  
}
