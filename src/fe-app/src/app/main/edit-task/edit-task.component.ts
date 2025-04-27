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
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './edit-task.component.html',
    styleUrl: './edit-task.component.css'
})
export class EditTaskComponent implements OnInit {
  @Input () assignment! : Assignment;
  @Output() close = new EventEmitter<Assignment>();

  route: ActivatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  loginService = inject(LoginService);
  courseService = inject(CourseService);
  assignmentService = inject(AssignmentService);
  courses: Course[] = [];
  errorMessage: string | null = null;

  editTaskForm = new FormGroup ({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    course: new FormControl('', Validators.required),
    due: new FormControl('', Validators.required),
    time: new FormControl('', Validators.required)
  });

  constructor() {}

  /**
   * Initializes the form with the assignment data if available
   * Note: ngOnInit is a lifecycle hook that is called when this component is initialized.
   */
  ngOnInit() {
    this.courseService.getCourses(this.loginService.getUserId())
    .then((courses: Course[]) => {
      this.courses = courses;
    })

    try {
      if (this.assignment) {
        const dueDate = this.assignment.availability?.adaptiveRelease?.end
        ? new Date(this.assignment.availability.adaptiveRelease.end)
        : null;

        let due = '';
        let time = '';

        if (dueDate) {
          const year = dueDate.getFullYear();
          const month = String(dueDate.getMonth() + 1).padStart(2, '0');
          const day = String(dueDate.getDate()).padStart(2, '0');
          due = `${year}-${month}-${day}`;
          time = dueDate.toTimeString().slice(0, 5);
        }

        this.editTaskForm.patchValue({
          title: this.assignment.title ?? '',
          description: this.assignment.description ?? '',
          course: this.assignment.courseId ?? '',
          due: due ?? '', // Ensures correct date format
          time: time
        });
      }
    }
    catch (error) {
      console.error('Error fetching assignments:', error);
    }
  }

  /**
   * Handles the form submission to edit a task
   */
  async editTask() {
    if(this.editTaskForm.invalid) {
      return;
    }

    let dueDate: Date | null = null;

    const date = this.editTaskForm.value.due;
    const time = this.editTaskForm.value.time;

    if (date && time) {
      dueDate = new Date(`${date}T${time}:00`);
    }

    try {
      await this.assignmentService.editTask(
        this.editTaskForm.value.title ?? '',
        this.editTaskForm.value.description ?? '',
        dueDate,
        this.loginService.getUserId(),
        this.editTaskForm.value.course ?? '',
        this.assignment?.id ?? ''
      )

      const updatedAssignment: Assignment = {
        ...this.assignment,
        title: this.editTaskForm.value.title ?? '',
        description: this.editTaskForm.value.description ?? '',
        availability: {
          adaptiveRelease: {
            end: dueDate ?? new Date(this.assignment.availability.adaptiveRelease.end)          }
        },
        courseId: this.editTaskForm.value.course ?? this.assignment.courseId
      };


      this.close.emit(updatedAssignment);
    } catch(error) {
      console.error('Edit task failed', error);
      this.errorMessage = 'An error occurred while editing the task. Please try again.';

      if(error instanceof Error) {
        if(error.message.includes('400')) {
          this.errorMessage = 'Duplicate task. Please try again.';
        }
      }
    }
  }
}
