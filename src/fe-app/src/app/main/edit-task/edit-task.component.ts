import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../login.service';
import { CourseService } from '../../course.service';
import { AssignmentService } from '../../assignment.service';
import { Assignment, Course } from '../../course';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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

  route: ActivatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  loginService = inject(LoginService);
  courseService = inject(CourseService);
  assignmentService = inject(AssignmentService);
  courses: Course[] = [];
  activeAssignment: Assignment | undefined = this.assignment;

  editTaskForm = new FormGroup ({
    title: new FormControl(''),
    description: new FormControl(''),
    course: new FormControl(''),
    due: new FormControl('')
  });

  async ngOnInit() {

    try {
      console.log(this.assignment);

      const assignmentId = String(this.route.snapshot.params['id']);
      console.log(assignmentId);
      const userId = this.loginService.getUserId();
      const assignments: Assignment[] = await this.assignmentService.getAssignments(userId);

      const assignment = assignments.find(a => a.id === assignmentId);
      //this.activeAssignment = assignment;
      console.log(this.activeAssignment);

      if (this.activeAssignment) {
        const dueDate = this.activeAssignment.availability?.adaptiveRelease?.end
        ? new Date(this.activeAssignment.availability.adaptiveRelease.end)
        : null;

        if (dueDate) {
          dueDate.setMinutes(dueDate.getMinutes() - dueDate.getTimezoneOffset()); // Adjust to local timezone
        }

        this.editTaskForm.patchValue({
          title: this.activeAssignment.title ?? '',
          description: this.activeAssignment.description ?? '',
          course: this.activeAssignment.courseId ?? '',
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
    let dueDate: Date | null = null;

    if (this.editTaskForm.value.due) {
      const selectedDate = new Date(this.editTaskForm.value.due);
      selectedDate.setMinutes(selectedDate.getMinutes() + selectedDate.getTimezoneOffset()); // Adjust back to UTC
      dueDate = selectedDate;
    }

    console.log(this.editTaskForm.value.course);

    this.assignmentService.editTask(
      this.editTaskForm.value.title ?? '',
      this.editTaskForm.value.description ?? '',
      dueDate,
      this.loginService.getUserId(),
      this.editTaskForm.value.course ?? '',
      this.activeAssignment?.id ?? ''
    )

    this.router.navigate(['/main/task-list']);
  }
}
