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

  /**
   * toggle the completion status of an assignment
   * @param assignment
   */
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

  /**
   * remove the task from the list
   */
  async removeTask() {
    try {
      this.assignmentService.removeTask(this.assignment.id);
      this.taskRemoved.emit(this.assignment.id as string);
    } catch (error) {
      console.error('Error removing task: ', error);
    }
  }

  /**
   * update the task in the list
   * @param updatedAssignment
   */
  updateTask(updatedAssignment: Assignment) {
    this.taskUpdated.emit(updatedAssignment);
  }

  /**
   * open the edit task or task popup
   */
  openPopup(type: 'edit-task' | 'task'): void {
    this.popupType = type;
    this.showPopup = true;
    document.addEventListener('keydown', this.handleEscapeKey);
  }

  /**
   * close the popup
   */
  closePopup(): void {
    this.showPopup = false;
    this.popupType = null;
    document.removeEventListener('keydown', this.handleEscapeKey);
  }

  /**
   * close the popup when the escape key is pressed
   * @param event
   */
  private handleEscapeKey = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.closePopup();
    }
  }

  /**
   * close the popup when the backdrop is clicked
   * @param event
   */
  handleBackdropClick(event: Event): void {
    this.closePopup();
  }
}
