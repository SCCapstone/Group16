import { Component, inject, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Assignment, Course } from '../../course';
import { CourseService } from '../../course.service';
import { LoginService } from '../../login.service';
import { CommonModule } from '@angular/common';
import { AssignmentService } from '../../assignment.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css'
})
export class AddTaskComponent {
  @Output() closePopup = new EventEmitter<void>();
  @Output() onTaskAdd = new EventEmitter<Assignment>();

  assignmentService = inject(AssignmentService);
  courseService = inject(CourseService);
  loginService = inject(LoginService);
  courses: Course[] = [];
  route: ActivatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  addTaskForm = new FormGroup ({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    course: new FormControl('', Validators.required),
    due: new FormControl('', Validators.required)
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

  async addTask() {
    console.log("AddTaskComponent - ADD TASK");
    
    if(this.addTaskForm.invalid) {
      return;
    }

    let dueDate: Date | null = null;

    if (this.addTaskForm.value.due) {
      const selectedDate = new Date(this.addTaskForm.value.due);
      selectedDate.setMinutes(selectedDate.getMinutes() + selectedDate.getTimezoneOffset()); // Adjust back to UTC
      dueDate = selectedDate;
    }

    try {
      await this.assignmentService.addTask(
        this.addTaskForm.value.title ?? '',
        this.addTaskForm.value.description ?? '',
        dueDate,
        this.loginService.getUserId(),
        this.addTaskForm.value.course ?? ''
      )

      // Temporary task with displayed info to display immediately after adding
      const newTask: Assignment = {
        id: crypto.randomUUID(),
        userId: this.loginService.getUserId() ?? '',
        title: this.addTaskForm.value.title ?? '',
        description: this.addTaskForm.value.description ?? '',
        courseId: this.addTaskForm.value.course ?? '',
        complete: false,
        availability: {
          adaptiveRelease: { end: dueDate ?? new Date() }
        },
        userCreated: false
      };

      console.log('Emitting new task:', newTask);
      this.onTaskAdd.emit(newTask);
      this.closePopup.emit();
    } catch (error) {
      console.error('Add task failed', error);
    }
  }
}
