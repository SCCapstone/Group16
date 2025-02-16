import { Component, inject, Input, OnInit } from '@angular/core';
import { Assignment, Course } from '../../../course';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AssignmentService } from '../../../assignment.service'; // Ensure the path is correct
import { CourseService } from '../../../course.service';
import { LoginService } from '../../../login.service';
import { RouterModule } from '@angular/router';
import { EditTaskComponent } from '../../edit-task/edit-task.component';
import { AddTaskComponent } from "../../add-task/add-task.component";



@Component({
  selector: 'app-task',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, EditTaskComponent, AddTaskComponent],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent implements OnInit {
  @Input() assignment!: Assignment;

  courseService = inject(CourseService);
  loginService = inject(LoginService)
  courseName = '';
  showPopup = false;
  popupType: 'edit-task' | null = null;
  //assignmentId = this.assignment.id ?? null;


  constructor(private assignmentService: AssignmentService) {}

  async ngOnInit() {
    try {
      const userId = this.loginService.getUserId();
      const courses: Course[] = await this.courseService.getCourses(userId);

      const course = courses.find(c => c.id === this.assignment.courseId);
      this.courseName = course ? course.name : 'Unknown Course';
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  }

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


openPopup(type: 'edit-task'): void {
  this.popupType = type;
  this.showPopup = true;
}


  closePopup(): void {
    this.showPopup = false;
    this.popupType = null;
  }

}
