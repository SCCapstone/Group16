import { Component, inject, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Assignment, Course } from '../../../course';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AssignmentService } from '../../../assignment.service'; // Ensure the path is correct
import { CourseService } from '../../../course.service';
import { LoginService } from '../../../login.service';
import { RouterModule } from '@angular/router';
import { EditTaskComponent } from '../../edit-task/edit-task.component';



@Component({
  selector: 'app-task',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, EditTaskComponent],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent implements OnInit {
  @Input() assignment!: Assignment;
  @Input() courseName!: String;
  @Output() taskRemoved = new EventEmitter<string>();
  @Output() taskUpdated = new EventEmitter<Assignment>();

  courseService = inject(CourseService);
  loginService = inject(LoginService)
  showPopup = false;
  popupType: 'edit-task' | 'task' | null = null;
  //assignmentId = this.assignment.id ?? null;


  constructor(private assignmentService: AssignmentService) {}

  ngOnInit() {}

  async toggleCompletion(assignment: Assignment) {
    // console.log("clicked");
    // console.log('Before ' + assignment.complete);
    try {
      const assignmentId = assignment.id ?? null;
      console.log(assignmentId);

      if (!assignmentId) {
        console.error('Assignment ID is missing!');
        return;
      }

      if (assignment.complete) {
        await this.assignmentService.openTask(assignmentId);
      } else {
        await this.assignmentService.completeTask(assignmentId);
      }
      // console.log('After ' + assignment.complete);

    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  }

  async removeTask() {
    try {
      this.assignmentService.removeTask(this.assignment.id);
      this.taskRemoved.emit(this.assignment.id as string);
    } catch (error) {
      console.error('Error removing task: ', error);
    }
  }

  updateTask(updatedAssignment: Assignment) {
    this.taskUpdated.emit(updatedAssignment);
  }

  openPopup(type: 'edit-task' | 'task'): void {
    this.popupType = type;
    this.showPopup = true;
    document.addEventListener('keydown', this.handleEscapeKey);
  }

  closePopup(): void {
    this.showPopup = false;
    this.popupType = null;
    document.removeEventListener('keydown', this.handleEscapeKey);
  }

  private handleEscapeKey = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.closePopup();
    }
  }

  handleBackdropClick(event: Event): void {
    this.closePopup();
  }
}
