import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Course } from '../../course';
import { CourseService } from '../../course.service';
import { LoginService } from '../../login.service';
import { CommonModule } from '@angular/common';
import { AssignmentService } from '../../assignment.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css'
})
export class AddTaskComponent {
  assignmentService = inject(AssignmentService);
  courseService = inject(CourseService);
  loginService = inject(LoginService);
  courses: Course[] = [];

  addTaskForm = new FormGroup ({
    title: new FormControl(''),
    description: new FormControl(''),
    course: new FormControl(''),
    due: new FormControl('')
  });

  // name: string = "";
  // description: string = "";
  // course: string = "";
  // // course: undefined; // TODO update type to Course when interface is created
  // due: Date = new Date();

  // displayOutput: boolean = false;  // TODO for testing, remove later

  constructor() {
    this.courseService.getCourses(this.loginService.getUserId())
    .then((courses: Course[]) => {
      this.courses = courses;
    })
  }

  addTask() {
    const dueDate = this.addTaskForm.value.due ? new Date(this.addTaskForm.value.due) : null;

    this.assignmentService.addTask(
      this.addTaskForm.value.title ?? '',
      this.addTaskForm.value.description ?? '',
      dueDate,
      this.loginService.getUserId(),
      this.addTaskForm.value.course ?? ''
    )
  }
}
