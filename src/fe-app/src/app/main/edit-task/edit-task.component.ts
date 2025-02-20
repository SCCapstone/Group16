import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../login.service';
import { CourseService } from '../../course.service';
import { AssignmentService } from '../../assignment.service';
import { Assignment, Course } from '../../course';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.css'
})
export class EditTaskComponent implements OnInit {
  @Input () assignment! : Assignment;
  @Output() close = new EventEmitter<void>();

  route: ActivatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  loginService = inject(LoginService);
  courseService = inject(CourseService);
  assignmentService = inject(AssignmentService);
  courses: Course[] = [];

  editTaskForm = new FormGroup ({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    course: new FormControl('', Validators.required),
    due: new FormControl('', Validators.required)
  });

  async ngOnInit() {

    try {
      if (this.assignment) {
        const dueDate = this.assignment.availability?.adaptiveRelease?.end
        ? new Date(this.assignment.availability.adaptiveRelease.end)
        : null;

        if (dueDate) {
          dueDate.setMinutes(dueDate.getMinutes() - dueDate.getTimezoneOffset()); // Adjust to local timezone
        }

        this.editTaskForm.patchValue({
          title: this.assignment.title ?? '',
          description: this.assignment.description ?? '',
          course: this.assignment.courseId ?? '',
          due: dueDate ? dueDate.toISOString().split('T')[0] : '' // Ensures correct date format
        });

        this.editTaskForm.get('course')?.valueChanges.subscribe(value => {
          console.log(value);
        })
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  }

  constructor() {
    this.courseService.getCourses(this.loginService.getUserId())
    .then((courses: Course[]) => {
      this.courses = courses;
    })
  }


  editTask() {
    if(this.editTaskForm.invalid) {
      return;
    }

    let dueDate: Date | null = null;

    if (this.editTaskForm.value.due) {
      const selectedDate = new Date(this.editTaskForm.value.due);
      selectedDate.setMinutes(selectedDate.getMinutes() + selectedDate.getTimezoneOffset()); // Adjust back to UTC
      dueDate = selectedDate;
    }

    console.log(this.editTaskForm.value.course);

    try {
      this.assignmentService.editTask(
        this.editTaskForm.value.title ?? '',
        this.editTaskForm.value.description ?? '',
        dueDate,
        this.loginService.getUserId(),
        this.editTaskForm.value.course ?? '',
        this.assignment?.id ?? ''
      )

      this.close.emit();
    } catch(error) {
      console.error('Edit task failed', error);
    }
  }
}
