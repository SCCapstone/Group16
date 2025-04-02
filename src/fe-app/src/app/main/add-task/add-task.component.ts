import { Component, inject, Output, EventEmitter, OnInit } from '@angular/core';
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
export class AddTaskComponent implements OnInit {
  @Output() closePopup = new EventEmitter<void>();
  @Output() onTaskAdd = new EventEmitter<Assignment>();

  assignmentService = inject(AssignmentService);
  courseService = inject(CourseService);
  loginService = inject(LoginService);
  courses: Course[] = [];
  route: ActivatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  showPopup = false;
  newTask2: Assignment | null = null;
  popupType: 'new-task' | null = null;
  showFormPopup = true;
  showTaskPopup = false;
  courseName: String | undefined;

  addTaskForm = new FormGroup ({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    course: new FormControl('', Validators.required),
    due: new FormControl('', Validators.required),
    time: new FormControl('', Validators.required)
  });

  constructor() {}

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

  async addTask() {
    console.log("AddTaskComponent - ADD TASK");

    if(this.addTaskForm.invalid) {
      alert('Missing required field')
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

      this.newTask2 = { ...newTask
        // id: crypto.randomUUID(),
        // userId: this.loginService.getUserId() ?? '',
        // title: this.addTaskForm.value.title ?? '',
        // description: this.addTaskForm.value.description ?? '',
        // courseId: this.addTaskForm.value.course ?? '',
        // complete: false,
        // availability: {
        //   adaptiveRelease: { end: dueDate ?? new Date() }
        // },
        // userCreated: false
      };
      this.courseName = this.getCourseNameByID(this.newTask2.courseId);
      console.log("new task course name: ", this.getCourseNameByID(this.newTask2.courseId));
      console.log('Emitting new task:', newTask);
      this.onTaskAdd.emit(newTask);
     this.showFormPopup = false;

     this.showTaskPopup = true;
     this.popupType = 'new-task';

   } catch (error) {
     console.error('Add task failed', error);
   }
 }

 closeFormPopup(): void {
   this.showFormPopup = false;
 }

 closeTaskPopup(): void {
   this.showTaskPopup = false;
 }

 getCourseNameByID(id: String): String {
  for (const course of this.courses) {
    if (course.id === id)
      return course.name
  }
  return "Unknown";
}
}