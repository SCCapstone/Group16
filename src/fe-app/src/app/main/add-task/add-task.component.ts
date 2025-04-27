import { Component, inject, Output, EventEmitter, OnInit, NgZone } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Assignment, Course } from '../../course';
import { CourseService } from '../../course.service';
import { LoginService } from '../../login.service';
import { CommonModule } from '@angular/common';
import { AssignmentService } from '../../assignment.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-add-task',
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './add-task.component.html',
    styleUrl: './add-task.component.css'
})
export class AddTaskComponent implements OnInit {
  @Output() closePopup = new EventEmitter<void>();
  @Output() onTaskAdd = new EventEmitter<Assignment>();

  assignmentService = inject(AssignmentService);
  courseService = inject(CourseService);
  loginService = inject(LoginService);
  courses: Course[] = [];
  route: ActivatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  private ngZone = inject(NgZone);
  showPopup = false;
  newTask2: Assignment | null = null;
  popupType: 'new-task' | null = null;
  showFormPopup = true;
  showTaskPopup = false;
  courseName: String | undefined;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  addTaskForm = new FormGroup ({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    course: new FormControl('', Validators.required),
    due: new FormControl('', Validators.required),
    time: new FormControl('', Validators.required)
  });

  constructor() {}

  /**
   * On opening the addTask popup get the courses and set the time to 11:59PM
   */
  ngOnInit() {
    this.courseService.getCourses(this.loginService.getUserId())
    .then((courses: Course[]) => {
      this.courses = courses;
    })

    const defaultTime = '23:59';

    this.addTaskForm.patchValue({
      time: defaultTime
    });
  }

  /**
   * Adds a task to the local list if API call to add a task is successful
   * Show newly added task in a new task pop up
   */
  async addTask() {
    if(this.addTaskForm.invalid) {
      this.errorMessage = 'Missing required field';
      return;
    }

    let dueDate: Date | null = null;

    const date = this.addTaskForm.value.due;
    const time = this.addTaskForm.value.time;

    if (date && time) {
      dueDate = new Date(`${date}T${time}:00`);
    }

    try {
      await this.assignmentService.addTask(
        this.addTaskForm.value.title ?? '',
        this.addTaskForm.value.description ?? '',
        dueDate ?? new Date(Date.now()),          // TODO temp fix
        this.loginService.getUserId() ?? "",
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

      this.newTask2 = { ...newTask };
      this.courseName = this.getCourseNameByID(this.newTask2.courseId);
      
      this.onTaskAdd.emit(newTask);
      this.showFormPopup = false;

      this.showTaskPopup = true;
      this.popupType = 'new-task';
      this.errorMessage = null;

    } catch (error) {
      console.error('Add task failed', error);
      this.errorMessage = 'An error occurred while adding the task. Please try again.';

      if(error instanceof Error) {
        if(error.message.includes('400')) {
          this.errorMessage = 'Duplicate task. Please try again.';
        }
      }
    }
  }

  /**
   * Does the same as addTask() except no new task pop up
   * Instead clears the form and allows users to keep adding tasks
   */
  async addMoreTasks() {
    if(this.addTaskForm.invalid) {
      this.errorMessage = 'Missing required field';
      return;
    }

    let dueDate: Date | null = null;

    const date = this.addTaskForm.value.due;
    const time = this.addTaskForm.value.time;

    if (date && time) {
      dueDate = new Date(`${date}T${time}:00`);
    }

    try {
      await this.assignmentService.addTask(
        this.addTaskForm.value.title ?? '',
        this.addTaskForm.value.description ?? '',
        dueDate ?? new Date(Date.now()),
        this.loginService.getUserId() ?? "",
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

      this.addTaskForm.reset();
      this.addTaskForm.patchValue({ time: '23:59' });
      this.onTaskAdd.emit(newTask);

      this.errorMessage = null;
      this.successMessage = 'Task added successfully!';

      this.ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          // Re-enter Angular zone to trigger change detection
          this.ngZone.run(() => {
            this.successMessage = null;
          });
        }, 3000);
      });

    } catch (error) {
      console.error('Add task failed', error);
      this.errorMessage = 'An error occurred while adding the task. Please try again.';

      if(error instanceof Error) {
        if(error.message.includes('400')) {
          this.errorMessage = 'Duplicate task. Please try again.';
        }
      }
    }
  }

  /**
   * Closes the Add Task form pop up
   */
  closeFormPopup(): void {
    this.showFormPopup = false;
  }

  /**
   * Close the New Task pop up
   */
  closeTaskPopup(): void {
    this.showTaskPopup = false;
  }

  /**
   * gets the course name by its id
   * @param id Course Id
   * @returns Course Name
   */
  getCourseNameByID(id: String): String {
    for (const course of this.courses) {
      if (course.id === id)
        return course.name
      }
    return "Unknown";
  }
}
